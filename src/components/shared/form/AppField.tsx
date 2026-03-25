import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  label?: string;
  type?: string;
  placeholder?: string;
  append?: React.ReactNode;
  className?: string;
}

const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
  className,
}: AppFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={field.name} className="text-sm font-semibold">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full pr-10 focus-visible:ring-primary",
            field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 &&
              "border-destructive focus-visible:ring-destructive"
          )}
        />
        {append && (
          <div className="absolute right-0 top-0 h-full flex items-center pr-1">
            {append}
          </div>
        )}
      </div>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
};

export default AppField;
