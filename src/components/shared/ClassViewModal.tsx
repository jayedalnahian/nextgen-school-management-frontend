"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Eye, School, Users, GraduationCap, BookOpen, DollarSign, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { IClass } from "@/types/class.types";

interface ClassViewModalProps {
  classData: IClass;
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

export function ClassViewModal({
  classData,
  buttonLabel = "View",
  isOpen: controlledIsOpen,
  onClose,
}: ClassViewModalProps) {
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
              <h2 className="text-xl font-semibold">Class Details</h2>
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
              {/* Class Profile Card */}
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <School className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{classData.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {classData.section && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          Section: {classData.section}
                        </Badge>
                      )}
                      <Badge variant="outline" className={classData.isDeleted ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"}>
                        {classData.isDeleted ? "Deleted" : "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Class ID</Label>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono text-muted-foreground">{classData.id}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Monthly Fee</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">${classData.monthlyFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Capacity</Label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{classData.capacity ? `${classData.capacity} students` : "Unlimited"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Section</Label>
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{classData.section || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Resources Count */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Assigned Resources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground text-xs">Students</Label>
                    </div>
                    <span className="text-2xl font-bold">{classData._count?.students || 0}</span>
                  </div>
                  <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground text-xs">Teachers</Label>
                    </div>
                    <span className="text-2xl font-bold">{classData._count?.teachers || 0}</span>
                  </div>
                  <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground text-xs">Subjects</Label>
                    </div>
                    <span className="text-2xl font-bold">{classData._count?.subjects || 0}</span>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              {classData.deletedAt && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Deletion Information
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      <strong>Deleted At:</strong> {new Date(classData.deletedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
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
