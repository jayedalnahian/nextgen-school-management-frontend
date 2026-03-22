"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DataTablePaginationProps {
  /** Pagination metadata from the API */
  meta: PaginationMeta;
  /** Callback when the page changes */
  onPageChange: (page: number) => void;
  /** Callback when rows-per-page changes */
  onPageSizeChange: (size: number) => void;
  /** Available page-size options */
  pageSizeOptions?: number[];
  /** Extra classes on the outer wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataTablePagination({
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: DataTablePaginationProps) {
  const { page, limit, total, totalPages } = meta;

  const [goToPage, setGoToPage] = React.useState("");

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(goToPage);
    if (!Number.isNaN(target) && target >= 1 && target <= totalPages) {
      onPageChange(target);
      setGoToPage("");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4",
        className,
      )}
    >
      {/* Left: Meta info */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {Math.min((page - 1) * limit + 1, total)}
        </span>
        –
        <span className="font-medium text-foreground">
          {Math.min(page * limit, total)}
        </span>{" "}
        of <span className="font-medium text-foreground">{total}</span> results
        &nbsp;·&nbsp; Page{" "}
        <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Rows
          </span>
          <Select
            value={String(limit)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Go-to-page */}
        <form onSubmit={handleGoToPage} className="flex items-center gap-1.5">
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            placeholder="Go to"
            className="h-8 w-[72px] text-sm"
          />
          <Button type="submit" variant="outline" size="sm" className="h-8">
            Go
          </Button>
        </form>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canGoPrev}
            onClick={() => onPageChange(1)}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canGoPrev}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canGoNext}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canGoNext}
            onClick={() => onPageChange(totalPages)}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
