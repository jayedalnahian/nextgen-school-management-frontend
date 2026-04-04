"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClass } from "@/services/class.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  updateClassSchema,
  IUpdateClassPayload,
} from "@/zod/auth.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { IClass } from "@/types/class.types";

interface ClassEditModalProps {
  classData: IClass;
  // Self-triggered mode (default)
  buttonLabel?: string;
  // Controlled mode (for DataTable)
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

// Dialog Overlay Component
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

// Dialog Content Component - Full screen on mobile, 16:9 on desktop
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "fixed z-50 bg-background shadow-lg flex flex-col",
        // Mobile: full screen
        "inset-0 w-full h-full",
        // Desktop: centered with 16:9 ratio
        "sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
        "sm:w-[90vw] sm:max-w-4xl sm:h-auto",
        "sm:rounded-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      style={{
        aspectRatio: "16/9",
        maxHeight: "90vh",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function ClassEditModal({
  classData,
  buttonLabel = "Edit",
  isOpen: controlledIsOpen,
  onClose,
  onSuccess,
}: ClassEditModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Determine if we're in controlled mode or self-triggered mode
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IUpdateClassPayload) => updateClass(classData.id, payload),
  });

  // Get default values based on existing class data
  const getDefaultValues = (): IUpdateClassPayload => {
    return {
      name: classData.name || "",
      section: classData.section || "",
      monthlyFee: classData.monthlyFee,
      capacity: classData.capacity || undefined,
    };
  };

  const form = useForm({
    defaultValues: getDefaultValues(),
    validators: {
      onChange: updateClassSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // Filter out empty values and unchanged values
        const payload: IUpdateClassPayload = {};

        Object.entries(value).forEach(([key, val]) => {
          if (val !== undefined && val !== "" && val !== null) {
            payload[key as keyof IUpdateClassPayload] = val as any;
          }
        });

        const result = await mutateAsync(payload);

        if (!result.success) {
          setServerError(result.message || "Failed to update class");
          return;
        }

        // Invalidate classes query
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["classes-all"] });

        if (isControlled) {
          onClose?.();
        } else {
          setInternalIsOpen(false);
        }
        onSuccess?.();
      } catch (error: any) {
        setServerError(error.message || "An unexpected error occurred");
      }
    },
  });

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }
    setServerError(null);
    form.reset();
  };

  return (
    <>
      {!isControlled && (
        <Button onClick={() => setInternalIsOpen(true)} variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
          <span className="sr-only">{buttonLabel}</span>
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DialogOverlay />
          <DialogContent>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">Edit Class</h2>
                <p className="text-sm text-muted-foreground">
                  Update details for {classData.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form
                method="POST"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                {/* Two Column Layout for Class Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form.Field
                    name="name"
                    validators={{ onChange: updateClassSchema.shape.name }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Class Name"
                        placeholder="Enter class name"
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name="section"
                    validators={{ onChange: updateClassSchema.shape.section }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Section"
                        placeholder="Enter section (optional)"
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name="monthlyFee"
                    validators={{ onChange: updateClassSchema.shape.monthlyFee }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Monthly Fee</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min="0"
                          step="0.01"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                          placeholder="Enter monthly fee"
                          className={cn(
                            field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <p className="text-xs font-medium text-destructive">
                              {field.state.meta.errors
                                .map((err: any) =>
                                  typeof err === "string" ? err : err.message
                                )
                                .join(", ")}
                            </p>
                          )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="capacity"
                    validators={{ onChange: updateClassSchema.shape.capacity }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Capacity</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min="0"
                          step="1"
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.handleChange(value ? parseInt(value, 10) : undefined);
                          }}
                          placeholder="Enter capacity (optional)"
                          className={cn(
                            field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <p className="text-xs font-medium text-destructive">
                              {field.state.meta.errors
                                .map((err: any) =>
                                  typeof err === "string" ? err : err.message
                                )
                                .join(", ")}
                            </p>
                          )}
                      </div>
                    )}
                  </form.Field>
                </div>

                {serverError && (
                  <Alert variant="destructive">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-4 border-t mt-4 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                    className="shrink-0"
                  >
                    Cancel
                  </Button>
                  <form.Subscribe
                    selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <AppSubmitButton
                        isPending={isSubmitting || isPending}
                        pendingLabel="Saving..."
                        disabled={!canSubmit}
                        className="shrink-0 w-auto"
                      >
                        Save Changes
                      </AppSubmitButton>
                    )}
                  </form.Subscribe>
                </div>
              </form>
            </div>
          </DialogContent>
        </div>
      )}
    </>
  );
}
