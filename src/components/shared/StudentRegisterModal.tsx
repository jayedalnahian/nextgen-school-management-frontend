"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registerStudent } from "@/services/student.service";
import { getClasses } from "@/services/class.service";
import { getParents } from "@/services/parent.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { registerStudentSchema, IRegisterStudentPayload } from "@/zod/auth.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { IParent } from "@/types/parent.types";
import { IClass } from "@/types/student.types";

interface StudentRegisterModalProps {
  buttonLabel?: string;
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

export function StudentRegisterModal({
  buttonLabel = "Add Student",
  onSuccess,
}: StudentRegisterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch classes and parents for dropdowns
  const { data: classesData } = useQuery({
    queryKey: ["classes"],
    queryFn: () => getClasses(),
    enabled: isOpen,
  });

  const { data: parentsData } = useQuery({
    queryKey: ["parents"],
    queryFn: () => getParents(""),
    enabled: isOpen,
  });

  const classes = classesData?.data || [];
  const parents = parentsData?.data || [];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterStudentPayload) => registerStudent(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      dob: "",
      gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
      classId: "",
      parentId: "",
    },
    validators: {
      onChange: registerStudentSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);

        if (!result.success) {
          setServerError(result.message || "Failed to register student");
          return;
        }

        // Invalidate students query to refresh the table
        queryClient.invalidateQueries({ queryKey: ["students"] });

        form.reset();
        setIsOpen(false);
        onSuccess?.();
      } catch (error: any) {
        setServerError(error.message || "An unexpected error occurred");
      }
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setServerError(null);
    form.reset();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {buttonLabel}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DialogOverlay />
          <DialogContent>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">Register New Student</h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below to register a new student.
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
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form.Field
                    name="name"
                    validators={{ onChange: registerStudentSchema.shape.name }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Full Name"
                        placeholder="Enter student name"
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name="dob"
                    validators={{ onChange: registerStudentSchema.shape.dob }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Date of Birth</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
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
                    name="gender"
                    validators={{ onChange: registerStudentSchema.shape.gender }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Gender</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value as "MALE" | "FEMALE" | "OTHER")
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 &&
                                "border-destructive focus-visible:ring-destructive"
                            )}
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
                    name="classId"
                    validators={{ onChange: registerStudentSchema.shape.classId }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Class</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            className={cn(
                              field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 &&
                                "border-destructive focus-visible:ring-destructive"
                            )}
                          >
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls: IClass) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name} {cls.section && `- ${cls.section}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    name="parentId"
                    validators={{ onChange: registerStudentSchema.shape.parentId }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Parent</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            className={cn(
                              field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 &&
                                "border-destructive focus-visible:ring-destructive"
                            )}
                          >
                            <SelectValue placeholder="Select parent" />
                          </SelectTrigger>
                          <SelectContent>
                            {parents.map((parent: IParent) => (
                              <SelectItem key={parent.parent.id} value={parent.parent.id}>
                                {parent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        pendingLabel="Registering..."
                        disabled={!canSubmit}
                        className="shrink-0 w-auto"
                      >
                        Register Student
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
