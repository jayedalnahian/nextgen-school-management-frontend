"use client";

import React, { useState } from "react";
import {
  useForm,
  DefaultValues,
  FieldValues,
  Path,
  Resolver,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ============================================================================
// Types
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
}

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "select"
  | "multi-select"
  | "textarea"
  | "date"
  | "switch"
  | "checkbox"
  | "custom";

export interface FormFieldConfig<TFieldValues extends FieldValues = FieldValues> {
  /** Field name – must match the Zod schema key */
  name: Path<TFieldValues>;
  /** Human-readable label */
  label: string;
  /** Type of field to render */
  type: FieldType;
  /** Placeholder text (for input, textarea, select) */
  placeholder?: string;
  /** Helper text shown below the field */
  description?: string;
  /** Options for select / multi-select fields */
  options?: SelectOption[];
  /** Disable this field individually */
  disabled?: boolean;
  /** Extra Tailwind classes on the field wrapper (useful for grid layouts) */
  className?: string;
  /** Custom render function – used when type is "custom" */
  customRender?: (field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
    disabled?: boolean;
  }) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ZodSchema = Parameters<typeof zodResolver>[0];

export interface FormBuilderProps<TFieldValues extends FieldValues> {
  /** Zod schema for validation */
  schema: ZodSchema;
  /** Field configurations */
  fields: FormFieldConfig<TFieldValues>[];
  /** Submit handler – receives validated data */
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  /** Default values for pre-populating the form (edit mode) */
  defaultValues?: DefaultValues<TFieldValues>;
  /** Global loading flag – disables all fields + shows spinner */
  isLoading?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Extra classes on the form's field grid wrapper */
  className?: string;
  /** Extra classes on the outer <form> element */
  formClassName?: string;
  /** Optional cancel button handler */
  onCancel?: () => void;
  /** Cancel button text */
  cancelText?: string;
}

// ============================================================================
// FormBuilder
// ============================================================================

export function FormBuilder<TFieldValues extends FieldValues>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  isLoading = false,
  submitText = "Submit",
  className,
  formClassName,
  onCancel,
  cancelText = "Cancel",
}: FormBuilderProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema) as unknown as Resolver<TFieldValues>,
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<TFieldValues>)}
        className={cn("space-y-6", formClassName)}
      >
        {/* ---- Field Grid ---- */}
        <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
          {fields.map((fieldConfig) => (
            <FormField
              key={fieldConfig.name}
              control={form.control}
              name={fieldConfig.name}
              render={({ field }) => (
                <FormItem className={fieldConfig.className}>
                  {/* Label — skip for switch/checkbox (rendered inline) */}
                  {fieldConfig.type !== "switch" &&
                    fieldConfig.type !== "checkbox" && (
                      <FormLabel>{fieldConfig.label}</FormLabel>
                    )}

                  <FormControl>
                    <FieldRenderer
                      fieldConfig={fieldConfig}
                      field={field}
                      disabled={isLoading || fieldConfig.disabled}
                    />
                  </FormControl>

                  {fieldConfig.description && (
                    <FormDescription>{fieldConfig.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* ---- Actions ---- */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitText}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

// ============================================================================
// FieldRenderer — renders the correct UI for each field type
// ============================================================================

interface FieldRendererProps<TFieldValues extends FieldValues> {
  fieldConfig: FormFieldConfig<TFieldValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  disabled?: boolean;
}

function FieldRenderer<TFieldValues extends FieldValues>({
  fieldConfig,
  field,
  disabled,
}: FieldRendererProps<TFieldValues>) {
  switch (fieldConfig.type) {
    case "text":
    case "email":
    case "number":
      return (
        <Input
          {...field}
          type={fieldConfig.type}
          placeholder={fieldConfig.placeholder}
          disabled={disabled}
          value={field.value ?? ""}
          onChange={(e) =>
            fieldConfig.type === "number"
              ? field.onChange(e.target.valueAsNumber || "")
              : field.onChange(e.target.value)
          }
        />
      );

    case "password":
      return <PasswordInput field={field} fieldConfig={fieldConfig} disabled={disabled} />;

    case "select":
      return (
        <Select
          value={field.value ?? ""}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={fieldConfig.placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {fieldConfig.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multi-select":
      return (
        <MultiSelectField
          options={fieldConfig.options ?? []}
          value={(field.value as string[]) ?? []}
          onChange={field.onChange}
          disabled={disabled}
        />
      );

    case "textarea":
      return (
        <Textarea
          {...field}
          placeholder={fieldConfig.placeholder}
          disabled={disabled}
          value={field.value ?? ""}
          rows={4}
        />
      );

    case "date":
      return (
        <DatePickerField
          value={field.value}
          onChange={field.onChange}
          placeholder={fieldConfig.placeholder}
          disabled={disabled}
        />
      );

    case "switch":
      return (
        <div className="flex items-center gap-3 py-1">
          <Switch
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            disabled={disabled}
            aria-label={fieldConfig.label}
          />
          <Label className="cursor-pointer" onClick={() => field.onChange(!field.value)}>
            {fieldConfig.label}
          </Label>
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2 py-1">
          <Checkbox
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            disabled={disabled}
            aria-label={fieldConfig.label}
          />
          <Label className="cursor-pointer leading-none" onClick={() => field.onChange(!field.value)}>
            {fieldConfig.label}
          </Label>
        </div>
      );

    case "custom":
      if (!fieldConfig.customRender) return null;
      return (
        <>
          {fieldConfig.customRender({
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
            name: field.name,
            disabled,
          })}
        </>
      );

    default:
      return null;
  }
}

// ============================================================================
// Sub-components
// ============================================================================

// ---- Password Input with show/hide toggle ----

function PasswordInput({
  field,
  fieldConfig,
  disabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldConfig: FormFieldConfig<any>;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        {...field}
        type={show ? "text" : "password"}
        placeholder={fieldConfig.placeholder}
        disabled={disabled}
        value={field.value ?? ""}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ---- DatePicker using Shadcn Calendar + Popover ----

function DatePickerField({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : (placeholder ?? "Pick a date")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// ---- Multi-Select as Checkbox Group ----

function MultiSelectField({
  options,
  value,
  onChange,
  disabled,
}: {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const toggle = (optValue: string) => {
    const next = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue];
    onChange(next);
  };

  return (
    <div className="grid gap-2 rounded-md border p-3">
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2">
          <Checkbox
            checked={value.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            disabled={disabled}
            aria-label={opt.label}
          />
          <Label
            className="cursor-pointer text-sm font-normal leading-none"
            onClick={() => !disabled && toggle(opt.value)}
          >
            {opt.label}
          </Label>
        </div>
      ))}
      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">No options available</p>
      )}
    </div>
  );
}
