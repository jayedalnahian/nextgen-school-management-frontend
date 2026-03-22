"use client";

import React, { useCallback } from "react";
import { X, ListFilter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  /** Unique key used as the query param name (e.g. "status", "classId") */
  key: string;
  /** Human-readable label */
  label: string;
  /** Available options for this filter */
  options: FilterOption[];
  /** Allow multiple selections? Default: false (single select) */
  multiple?: boolean;
}

export type ActiveFilters = Record<string, string[]>;

interface DataTableFiltersProps {
  /** Filter definitions */
  filters: FilterConfig[];
  /** Currently active filters */
  activeFilters: ActiveFilters;
  /** Called whenever filters change */
  onFilterChange: (filters: ActiveFilters) => void;
  /** Extra classes on the outer wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataTableFilters({
  filters,
  activeFilters,
  onFilterChange,
  className,
}: DataTableFiltersProps) {
  // ----- helpers -----------------------------------------------------------

  const toggleValue = useCallback(
    (key: string, value: string, multiple: boolean) => {
      const current = activeFilters[key] ?? [];

      let next: string[];
      if (multiple) {
        next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
      } else {
        next = current.includes(value) ? [] : [value];
      }

      const updated = { ...activeFilters, [key]: next };
      // Remove empty keys
      if (next.length === 0) delete updated[key];
      onFilterChange(updated);
    },
    [activeFilters, onFilterChange],
  );

  const clearAll = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  const removeFilter = useCallback(
    (key: string, value: string) => {
      const current = activeFilters[key] ?? [];
      const next = current.filter((v) => v !== value);
      const updated = { ...activeFilters, [key]: next };
      if (next.length === 0) delete updated[key];
      onFilterChange(updated);
    },
    [activeFilters, onFilterChange],
  );

  // ----- derived -----------------------------------------------------------

  const activeCount = Object.values(activeFilters).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const getOptionLabel = (filterKey: string, value: string) => {
    const cfg = filters.find((f) => f.key === filterKey);
    return cfg?.options.find((o) => o.value === value)?.label ?? value;
  };

  // ----- render ------------------------------------------------------------

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {filters.map((filter) => {
        const selected = activeFilters[filter.key] ?? [];

        return (
          <Popover key={filter.key}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 gap-1.5 text-sm",
                  selected.length > 0 && "border-primary/50",
                )}
              >
                <ListFilter className="h-3.5 w-3.5" />
                {filter.label}
                {selected.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-5 justify-center rounded-full px-1 text-xs"
                  >
                    {selected.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-52 p-2">
              <div className="space-y-1">
                {filter.options.map((opt) => {
                  const isActive = selected.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        toggleValue(
                          filter.key,
                          opt.value,
                          filter.multiple ?? false,
                        )
                      }
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30",
                        )}
                      >
                        {isActive && <Check className="h-3 w-3" />}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        );
      })}

      {/* Active filter badges */}
      {activeCount > 0 && (
        <>
          {Object.entries(activeFilters).map(([key, values]) =>
            values.map((v) => (
              <Badge
                key={`${key}-${v}`}
                variant="secondary"
                className="gap-1 pl-2 pr-1 text-xs"
              >
                {getOptionLabel(key, v)}
                <button
                  type="button"
                  onClick={() => removeFilter(key, v)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </button>
              </Badge>
            )),
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </>
      )}
    </div>
  );
}
