"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Eye, Mail, User, Calendar, Briefcase, Phone, MapPin, GraduationCap, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// User type based on the combined data from tables
interface IUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: "ADMIN" | "TEACHER" | "PARENT" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  emailVerified: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
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

interface UserViewModalProps {
  user: IUser;
  // Self-triggered mode (default)
  buttonLabel?: string;
  // Controlled mode (for DataTable)
  isOpen?: boolean;
  onClose?: () => void;
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
      {...props}
    >
      {children}
    </div>
  );
}

// Helper to format dates
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Helper to get role color
function getRoleBadgeColor(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "ADMIN":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "TEACHER":
      return "bg-green-100 text-green-800 border-green-200";
    case "PARENT":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Helper to get status color
function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "INACTIVE":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "SUSPENDED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function UserViewModal({
  user,
  buttonLabel = "View",
  isOpen: controlledIsOpen,
  onClose,
}: UserViewModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Determine if we're in controlled mode or self-triggered mode
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }
  };

  // Get role-specific data
  const roleData = user.admin || user.teacher || user.parent;

  return (
    <>
      {!isControlled && (
        <Button onClick={() => setInternalIsOpen(true)} variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
          <span className="sr-only">{buttonLabel}</span>
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DialogOverlay onClick={handleClose} data-state="open" />
          <DialogContent data-state="open" className="max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">User Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* User Profile Card */}
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{user.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                        {user.role.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                        {user.status}
                      </Badge>
                      {user.emailVerified && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">User ID</Label>
                    <span className="text-sm font-mono text-muted-foreground">{user.id}</span>
                  </div>
                  {user.createdAt && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Member Since</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  )}
                  {user.updatedAt && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Last Updated</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(user.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Role-specific Information */}
              {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? (
                user.admin && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Admin Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.admin.designation && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Designation</Label>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.admin.designation}</span>
                          </div>
                        </div>
                      )}
                      {user.admin.phone && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Phone</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.admin.phone}</span>
                          </div>
                        </div>
                      )}
                      {user.admin.joiningDate && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Joining Date</Label>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(user.admin.joiningDate)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : user.role === "TEACHER" ? (
                user.teacher && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Teacher Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.teacher.specialization && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Specialization</Label>
                          <span className="text-sm">{user.teacher.specialization}</span>
                        </div>
                      )}
                      {user.teacher.qualification && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Qualification</Label>
                          <span className="text-sm">{user.teacher.qualification}</span>
                        </div>
                      )}
                      {user.teacher.phone && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Phone</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.teacher.phone}</span>
                          </div>
                        </div>
                      )}
                      {user.teacher.joiningDate && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Joining Date</Label>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(user.teacher.joiningDate)}</span>
                          </div>
                        </div>
                      )}
                      {user.teacher.bio && (
                        <div className="space-y-1 md:col-span-2">
                          <Label className="text-muted-foreground text-xs flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Bio
                          </Label>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {user.teacher.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : user.role === "PARENT" ? (
                user.parent && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Parent Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.parent.phone && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Phone</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.parent.phone}</span>
                          </div>
                        </div>
                      )}
                      {user.parent.occupation && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground text-xs">Occupation</Label>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.parent.occupation}</span>
                          </div>
                        </div>
                      )}
                      {user.parent.address && (
                        <div className="space-y-1 md:col-span-2">
                          <Label className="text-muted-foreground text-xs flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Address
                          </Label>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {user.parent.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : null}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-muted/30">
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </div>
          </DialogContent>
        </div>
      )}
    </>
  );
}
