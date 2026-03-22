"use client";

import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DataTableSearchProps {
  /** Current search value (controlled) */
  value: string;
  /** Fired after debounce elapses */
  onSearch: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms – defaults to 700 */
  debounceMs?: number;
  /** Extra classes on the outer wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataTableSearch({
  value,
  onSearch,
  placeholder = "Search...",
  debounceMs = 700,
  className,
}: DataTableSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setLocalValue(next);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch(next);
      }, debounceMs);
    },
    [onSearch, debounceMs],
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    onSearch("");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [onSearch]);

  // Keep local value in sync when parent resets the controlled value
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-8"
      />
      {localValue.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
