"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteUser } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// User type for delete modal
interface IUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "PARENT" | "SUPER_ADMIN";
}

interface UserDeleteModalProps {
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

// Dialog Content Component
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
        // Desktop: centered dialog
        "sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
        "sm:w-[90vw] sm:max-w-md sm:max-h-[90vh]",
        "sm:rounded-lg sm:h-auto",
        "overflow-hidden",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function UserDeleteModal({
  user,
  buttonLabel = "Delete",
  isOpen: controlledIsOpen,
  onClose,
  onSuccess,
}: UserDeleteModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Determine if we're in controlled mode or self-triggered mode
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteUser(user.id),
  });

  const handleDelete = async () => {
    setServerError(null);

    const result = await mutateAsync();

    if (!result.success) {
      setServerError(result.message || "Failed to delete user");
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
  };

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }
    setServerError(null);
  };

  // Helper to get role display name
  const getRoleDisplayName = (role: string) => {
    return role.replace("_", " ");
  };

  return (
    <>
      {!isControlled && (
        <Button
          onClick={() => setInternalIsOpen(true)}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">{buttonLabel}</span>
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DialogOverlay onClick={handleClose} data-state="open" />
          <DialogContent data-state="open">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-red-800">Delete User</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 hover:bg-red-100"
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Error Alert */}
              {serverError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              {/* Warning Message */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>

                <div className="bg-muted/50 rounded-lg p-4 border border-muted">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRoleDisplayName(user.role)}
                  </p>
                </div>
              </div>

              {/* Warning Note */}
              <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Deleting this user will remove all associated data and cannot be recovered.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-muted/30 flex-shrink-0">
              <Button
                onClick={handleClose}
                variant="outline"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isPending}
                variant="destructive"
                className="gap-2"
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete User
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </div>
      )}
    </>
  );
}
