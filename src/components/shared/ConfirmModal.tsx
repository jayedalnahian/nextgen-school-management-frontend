"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface ConfirmModalProps {
  /** The trigger element (e.g. a Delete button) */
  children: React.ReactNode;
  /** Callback when the user confirms — can be async */
  onConfirm: () => void | Promise<void>;
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
  /** Confirm button label */
  confirmText?: string;
  /** Cancel button label */
  cancelText?: string;
  /** Visual variant – "danger" uses destructive styling */
  variant?: "danger" | "primary";
  /** Show spinner + disable confirm while loading */
  isLoading?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ConfirmModal({
  children,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmModalProps) {
  const [open, setOpen] = useState(false);

  const isDanger = variant === "danger";

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("ConfirmModal: onConfirm threw an error", error);
      // Keep modal open so the user can retry
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* Stop propagation so parent elements (e.g. table rows) don't fire */}
        <span
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="inline-flex"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              setOpen(true);
            }
          }}
        >
          {children}
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isDanger && (
              <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              isDanger &&
                "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive",
            )}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
