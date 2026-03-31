"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/auth.service";
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
import {
  updateUserSchema,
  IUpdateUserPayload,
} from "@/zod/auth.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";

// User type based on the combined data from tables
interface IUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: "ADMIN" | "TEACHER" | "PARENT" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  admin?: {
    designation?: string | null;
    phone?: string | null;
    joiningDate?: string | null;
  } | null;
  teacher?: {
    specialization?: string | null;
    qualification?: string | null;
    bio?: string | null;
    phone?: string | null;
    joiningDate?: string | null;
  } | null;
  parent?: {
    phone?: string | null;
    address?: string | null;
    occupation?: string | null;
  } | null;
}

interface UserEditModalProps {
  user: IUser;
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

export function UserEditModal({
  user,
  buttonLabel = "Edit",
  isOpen: controlledIsOpen,
  onClose,
  onSuccess,
}: UserEditModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Determine if we're in controlled mode or self-triggered mode
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IUpdateUserPayload) => updateUser(user.id, payload),
  });

  // Get default values based on user role and existing data
  const getDefaultValues = (): IUpdateUserPayload => {
    const base = {
      name: user.name || "",
      image: user.image || "",
      role: user.role,
      status: user.status,
    };

    switch (user.role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return {
          ...base,
          designation: user.admin?.designation || "",
          phone: user.admin?.phone || "",
          joiningDate: user.admin?.joiningDate || "",
        };
      case "TEACHER":
        return {
          ...base,
          phone: user.teacher?.phone || "",
          specialization: user.teacher?.specialization || "",
          qualification: user.teacher?.qualification || "",
          bio: user.teacher?.bio || "",
          joiningDate: user.teacher?.joiningDate || "",
        };
      case "PARENT":
        return {
          ...base,
          phone: user.parent?.phone || "",
          address: user.parent?.address || "",
          occupation: user.parent?.occupation || "",
        };
      default:
        return base;
    }
  };

  const form = useForm({
    defaultValues: getDefaultValues(),
    validators: {
      onChange: updateUserSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // Filter out empty values and unchanged values
        const payload: IUpdateUserPayload = {};

        Object.entries(value).forEach(([key, val]) => {
          if (val !== undefined && val !== "" && val !== null) {
            payload[key as keyof IUpdateUserPayload] = val as any;
          }
        });

        const result = await mutateAsync(payload);

        if (!result.success) {
          setServerError(result.message || "Failed to update user");
          return;
        }

        // Invalidate relevant queries based on role
        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
          queryClient.invalidateQueries({ queryKey: ["admins"] });
        } else if (user.role === "TEACHER") {
          queryClient.invalidateQueries({ queryKey: ["teachers"] });
        } else if (user.role === "PARENT") {
          queryClient.invalidateQueries({ queryKey: ["parents"] });
        }

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
                <h2 className="text-xl font-semibold">Edit User</h2>
                <p className="text-sm text-muted-foreground">
                  Update details for {user.name} ({user.role.toLowerCase()})
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
                {/* Two Column Layout for Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form.Field
                    name="name"
                    validators={{ onChange: updateUserSchema.shape.name }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Full Name"
                        placeholder="Enter full name"
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name="status"
                    validators={{ onChange: updateUserSchema.shape.status }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Status</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value as "ACTIVE" | "INACTIVE" | "SUSPENDED")
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 &&
                                "border-destructive focus-visible:ring-destructive"
                            )}
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="SUSPENDED">Suspended</SelectItem>
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

                {/* Role-Specific Fields */}
                {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="designation"
                      validators={{
                        onChange: updateUserSchema.shape.designation,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Designation"
                          placeholder="Enter designation"
                        />
                      )}
                    </form.Field>
                    <form.Field
                      name="phone"
                      validators={{
                        onChange: updateUserSchema.shape.phone,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Phone"
                          placeholder="Enter phone number"
                        />
                      )}
                    </form.Field>
                    <form.Field
                      name="joiningDate"
                      validators={{
                        onChange: updateUserSchema.shape.joiningDate,
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Joining Date</Label>
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
                  </div>
                )}

                {user.role === "TEACHER" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="specialization"
                      validators={{
                        onChange: updateUserSchema.shape.specialization,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Specialization"
                          placeholder="Enter specialization"
                        />
                      )}
                    </form.Field>
                    <form.Field
                      name="qualification"
                      validators={{
                        onChange: updateUserSchema.shape.qualification,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Qualification"
                          placeholder="Enter qualification"
                        />
                      )}
                    </form.Field>
                    <form.Field
                      name="phone"
                      validators={{
                        onChange: updateUserSchema.shape.phone,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Phone"
                          placeholder="Enter phone number"
                        />
                      )}
                    </form.Field>
                    <form.Field
                      name="joiningDate"
                      validators={{
                        onChange: updateUserSchema.shape.joiningDate,
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Joining Date</Label>
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
                      name="bio"
                      validators={{
                        onChange: updateUserSchema.shape.bio,
                      }}
                    >
                      {(field) => (
                        <div className="col-span-full space-y-2">
                          <Label htmlFor={field.name}>Bio</Label>
                          <textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter bio"
                            className={cn(
                              "w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
                )}

                {user.role === "PARENT" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="phone"
                      validators={{
                        onChange: updateUserSchema.shape.phone,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Phone"
                          placeholder="Enter phone number"
                        />
                      )}
                    </form.Field>
                    <form.Field
                      name="address"
                      validators={{
                        onChange: updateUserSchema.shape.address,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Address"
                          placeholder="Enter address"
                        />
                      )}
                    </form.Field>
                    <form.Field
                      name="occupation"
                      validators={{
                        onChange: updateUserSchema.shape.occupation,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Occupation"
                          placeholder="Enter occupation"
                        />
                      )}
                    </form.Field>
                  </div>
                )}

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
