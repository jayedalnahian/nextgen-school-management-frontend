"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Eye, Calendar, GraduationCap, User, MapPin, Phone, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { IStudent } from "@/types/student.types";

interface StudentViewModalProps {
  student: IStudent;
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

export function StudentViewModal({
  student,
  buttonLabel = "View",
  isOpen: controlledIsOpen,
  onClose,
}: StudentViewModalProps) {
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
          <DialogContent data-state="open" className="max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Student Details</h2>
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
              {/* Student Profile Card */}
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={undefined} alt={student.name} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{student.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        Student ID: {student.studentID}
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Roll: {student.roll}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                        {student.gender}
                      </Badge>
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
                    <Label className="text-muted-foreground text-xs">Student ID</Label>
                    <span className="text-sm font-mono text-muted-foreground">{student.id}</span>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Roll Number</Label>
                    <span className="text-sm">{student.roll}</span>
                  </div>
                  {student.dob && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Date of Birth</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(student.dob)}</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Gender</Label>
                    <span className="text-sm">{student.gender}</span>
                  </div>
                  {student.admissionDate && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Admission Date</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(student.admissionDate)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Class Information */}
              {student.class && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Class Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Class</Label>
                      <span className="text-sm">{student.class.name}</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Section</Label>
                      <span className="text-sm">{student.class.section}</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Monthly Fee</Label>
                      <span className="text-sm">${student.class.monthlyFee}</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Capacity</Label>
                      <span className="text-sm">{student.class.capacity} students</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Parent Information */}
              {student.parent && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Parent Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Parent Name</Label>
                      <span className="text-sm">{"N/A"}</span>
                    </div>
                    {student.parent.phone && (
                      <div className="space-y-1">
                        <Label className="text-muted-foreground text-xs">Phone</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{student.parent.phone}</span>
                        </div>
                      </div>
                    )}
                    {student.parent.occupation && (
                      <div className="space-y-1">
                        <Label className="text-muted-foreground text-xs">Occupation</Label>
                        <span className="text-sm">{student.parent.occupation}</span>
                      </div>
                    )}
                    {student.parent.address && (
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-muted-foreground text-xs flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                        </Label>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {student.parent.address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
