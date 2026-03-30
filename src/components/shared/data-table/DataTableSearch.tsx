"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DataTableSearchProps {
  initialValue?: string;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
  onDebouncedChange: (value: string) => void;
}

const DataTableSearch = ({
  initialValue = "",
  placeholder = "Search...",
  debounceMs = 700,
  isLoading,
  onDebouncedChange,
}: DataTableSearchProps) => {
  const [value, setValue] = useState(initialValue);
  const skipNextDebounceRef = useRef(false);

  // Sync with prop when it change from outside (e.g. URL change, clear filters, etc.)
  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want to sync on prop change
  }, [initialValue]);

  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onDebouncedChange(value.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange]);

  const handleClear = () => {
    skipNextDebounceRef.current = true;
    setValue("");
    onDebouncedChange("");
  };

  return (
    <div className="relative w-full md:max-w-sm">
      {isLoading ? (
        <Loader2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin" />
      ) : (
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      )}
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-9 pr-9 pl-9"
      />

      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default DataTableSearch;
