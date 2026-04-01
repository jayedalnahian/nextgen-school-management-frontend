"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudent } from "@/services/student.service";
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
import { Edit, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { IClass } from "@/types/student.types";
import { IParent } from "@/types/parent.types";

// Update schema for student
const updateStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dob: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  classId: z.string().optional(),
  roll: z.number().optional(),
});

type IUpdateStudentPayload = z.infer<typeof updateStudentSchema>;

// Student type for modal
interface IStudent {
  id: string;
  studentID: string;
  name: string;
  roll: number;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  classId: string;
  parentId: string;
  class: IClass;
  parent: IParent["parent"] & { user?: { name: string; email: string } };
}

interface StudentEditModalProps {
  student: IStudent;
  classes: IClass[];
  parents: IParent[];
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

// Dialog Content Component - Full screen on mobile, centered on desktop
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
        // Desktop: centered
        "sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
        "sm:w-[90vw] sm:max-w-2xl sm:h-auto",
        "sm:rounded-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      style={{
        maxHeight: "90vh",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function StudentEditModal({
  student,
  classes,
  parents,
  buttonLabel = "Edit",
  isOpen: controlledIsOpen,
  onClose,
  onSuccess,
}: StudentEditModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Determine if we're in controlled mode or self-triggered mode
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IUpdateStudentPayload) => updateStudent(student.id, payload),
  });

  // Get default values based on existing student data
  const getDefaultValues = (): IUpdateStudentPayload => {
    return {
      name: student.name || "",
      dob: student.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
      gender: student.gender,
      classId: student.classId,
      roll: student.roll,
    };
  };

  const form = useForm({
    defaultValues: getDefaultValues(),
    validators: {
      onChange: updateStudentSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // Filter out empty values and unchanged values
        const payload: Partial<IUpdateStudentPayload> = {};

        Object.entries(value).forEach(([key, val]) => {
          if (val !== undefined && val !== "" && val !== null) {
            payload[key as keyof IUpdateStudentPayload] = val as any;
          }
        });

        const result = await mutateAsync(payload as IUpdateStudentPayload);

        if (!result.success) {
          setServerError(result.message || "Failed to update student");
          return;
        }

        // Invalidate students query
        queryClient.invalidateQueries({ queryKey: ["students"] });

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
            <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold">Edit Student</h2>
                <p className="text-sm text-muted-foreground">
                  Update details for {student.name} (ID: {student.studentID})
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
                  {/* Student Name */}
                  <form.Field
                    name="name"
                    validators={{ onChange: updateStudentSchema.shape.name }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Full Name"
                        placeholder="Enter full name"
                      />
                    )}
                  </form.Field>

                  {/* Roll Number */}
                  <form.Field
                    name="roll"
                    validators={{ onChange: updateStudentSchema.shape.roll }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Roll Number</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(parseInt(e.target.value) || undefined)}
                          placeholder="Enter roll number"
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

                  {/* Date of Birth */}
                  <form.Field
                    name="dob"
                    validators={{ onChange: updateStudentSchema.shape.dob }}
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

                  {/* Gender */}
                  <form.Field
                    name="gender"
                    validators={{ onChange: updateStudentSchema.shape.gender }}
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

                  {/* Class */}
                  <form.Field
                    name="classId"
                    validators={{ onChange: updateStudentSchema.shape.classId }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Class</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value)
                          }
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
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name} - Section {cls.section}
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

                {/* Read-only Parent Info */}
                <div className="bg-muted/50 rounded-lg p-4 border border-muted">
                  <Label className="text-muted-foreground mb-2 block">Parent Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">{student.parent?.user?.name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">Parent Name</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{student.parent?.phone || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">Phone</p>
                    </div>
                  </div>
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
