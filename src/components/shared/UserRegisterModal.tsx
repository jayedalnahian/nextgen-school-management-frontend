"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "@/services/auth.service";
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
import { UserRole } from "@/lib/authUtils";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  baseRegisterSchema,
  registerParentSchema,
  registerTeacherSchema,
  registerAdminSchema,
  IRegisterPayload,
} from "@/zod/auth.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";

interface UserRegisterModalProps {
  defaultRole?: UserRole;
  allowRoleChange?: boolean;
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

export function UserRegisterModal({
  defaultRole = "ADMIN",
  allowRoleChange = true,
  buttonLabel = "Register User",
  onSuccess,
}: UserRegisterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [serverError, setServerError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerUser(payload as any),
  });

  // Get the appropriate schema based on role
  const getSchemaForRole = (userRole: UserRole) => {
    switch (userRole) {
      case "PARENT":
        return registerParentSchema;
      case "TEACHER":
        return registerTeacherSchema;
      case "ADMIN":
        return registerAdminSchema;
      default:
        return registerAdminSchema;
    }
  };

  // Get default values based on role
  const getDefaultValues = (userRole: UserRole): IRegisterPayload => {
    const base = {
      email: "",
      password: "",
      name: "",
      phone: "",
    };

    switch (userRole) {
      case "PARENT":
        return {
          ...base,
          role: "PARENT",
          address: "",
          occupation: "",
        };
      case "TEACHER":
        return {
          ...base,
          role: "TEACHER",
          specialization: "",
          qualification: "",
          joiningDate: "",
        };
      case "ADMIN":
        return {
          ...base,
          role: "ADMIN",
          designation: "",
          joiningDate: "",
        };
      default:
        return { ...base, role: "ADMIN", designation: "", joiningDate: "" };
    }
  };

  const form = useForm({
    defaultValues: getDefaultValues(role),
    validators: {
      onChange: getSchemaForRole(role),
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const payload = {
          ...value,
          image,
        };

        const result = await mutateAsync(payload as any);

        if (!result.success) {
          setServerError(result.message || "Failed to register user");
          return;
        }

        // Invalidate relevant queries based on role
        if (role === "ADMIN") {
          queryClient.invalidateQueries({ queryKey: ["admins"] });
        } else if (role === "TEACHER") {
          queryClient.invalidateQueries({ queryKey: ["teachers"] });
        } else if (role === "PARENT") {
          queryClient.invalidateQueries({ queryKey: ["parents"] });
        }

        form.reset();
        setImage(null);
        setIsOpen(false);
        onSuccess?.();
      } catch (error: any) {
        setServerError(error.message || "An unexpected error occurred");
      }
    },
  });

  const handleRoleChange = (value: UserRole) => {
    setRole(value);
    setImage(null);
    form.reset(getDefaultValues(value));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setServerError(null);
    setImage(null);
    form.reset(getDefaultValues(role));
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
                <h2 className="text-xl font-semibold">Register New User</h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below to register a new {role.toLowerCase()}.
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
                {/* Role Selection */}
                {allowRoleChange && (
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={role}
                      onValueChange={(value) =>
                        handleRoleChange(value as UserRole)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                        <SelectItem value="PARENT">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Two Column Layout for Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form.Field
                    name="name"
                    validators={{ onChange: baseRegisterSchema.shape.name }}
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
                    name="email"
                    validators={{ onChange: baseRegisterSchema.shape.email }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Email"
                        type="email"
                        placeholder="Enter email address"
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name="password"
                    validators={{ onChange: baseRegisterSchema.shape.password }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name="phone"
                    validators={{ onChange: baseRegisterSchema.shape.phone }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Phone"
                        placeholder="Enter phone number"
                      />
                    )}
                  </form.Field>
                </div>

                {/* Profile Image */}
                <div className="space-y-2">
                  <Label htmlFor="image">Profile Image (Optional)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Role-Specific Fields */}
                {role === "PARENT" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="address"
                      validators={{
                        onChange: registerParentSchema.shape.address,
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
                        onChange: registerParentSchema.shape.occupation,
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

                {role === "TEACHER" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <form.Field
                      name="specialization"
                      validators={{
                        onChange: registerTeacherSchema.shape.specialization,
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
                        onChange: registerTeacherSchema.shape.qualification,
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
                      name="joiningDate"
                      validators={{
                        onChange: registerTeacherSchema.shape.joiningDate,
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

                {role === "ADMIN" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="designation"
                      validators={{
                        onChange: registerAdminSchema.shape.designation,
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
                      name="joiningDate"
                      validators={{
                        onChange: registerAdminSchema.shape.joiningDate,
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
                        Register {role}
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
