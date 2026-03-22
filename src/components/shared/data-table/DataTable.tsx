"use client";

import React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, FileX2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { DataTableSearch } from "./DataTableSearch";
import {
  DataTablePagination,
  type PaginationMeta,
} from "./DataTablePagination";
import {
  DataTableFilters,
  type FilterConfig,
  type ActiveFilters,
} from "./DataTableFilters";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Action that appears in the row-action dropdown */
export interface RowAction<TData> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: TData) => void;
  /** Optional: hide this action for certain rows */
  hidden?: (row: TData) => boolean;
  /** Render the item with destructive styles */
  destructive?: boolean;
}

export interface DataTableProps<TData, TValue> {
  /** Column definitions (tanstack/react-table) */
  columns: ColumnDef<TData, TValue>[];
  /** Row data */
  data: TData[];
  /** Loading state (e.g. from Tanstack Query isFetching) */
  isLoading?: boolean;

  // ---- Sorting ----
  /** Controlled sorting state */
  sorting?: SortingState;
  /** Callback when sorting changes */
  onSortingChange?: OnChangeFn<SortingState>;

  // ---- Search ----
  /** Enable the search bar */
  searchable?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;

  // ---- Filters ----
  /** Filter configurations */
  filters?: FilterConfig[];
  activeFilters?: ActiveFilters;
  onFilterChange?: (filters: ActiveFilters) => void;

  // ---- Pagination ----
  /** Pagination metadata from the API */
  paginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  // ---- Row actions ----
  rowActions?: RowAction<TData>[];

  // ---- Empty state ----
  emptyTitle?: string;
  emptyDescription?: string;

  // ---- Misc ----
  className?: string;
}

// ---------------------------------------------------------------------------
// Sortable header helper
// ---------------------------------------------------------------------------

export function SortableHeader({
  label,
  column,
}: {
  label: string;
  column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" };
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1 text-xs font-semibold uppercase tracking-wide"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="h-3.5 w-3.5" />
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Main DataTable component
// ---------------------------------------------------------------------------

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  sorting,
  onSortingChange,
  searchable = false,
  searchValue = "",
  onSearch,
  searchPlaceholder,
  filters = [],
  activeFilters = {},
  onFilterChange,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
  rowActions,
  emptyTitle = "No data available",
  emptyDescription = "There are no records to display at the moment.",
  className,
}: DataTableProps<TData, TValue>) {
  // Build final column list (append actions column if needed)
  const finalColumns: ColumnDef<TData, TValue>[] = React.useMemo(() => {
    if (!rowActions || rowActions.length === 0) return columns;

    const actionsCol: ColumnDef<TData, TValue> = {
      id: "_actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const visibleActions = rowActions.filter(
          (a) => !a.hidden || !a.hidden(row.original),
        );
        if (visibleActions.length === 0) return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {visibleActions.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  onClick={() => action.onClick(row.original)}
                  className={cn(
                    action.destructive && "text-destructive focus:text-destructive",
                  )}
                >
                  {action.icon && (
                    <span className="mr-2 h-4 w-4">{action.icon}</span>
                  )}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    };

    return [...columns, actionsCol];
  }, [columns, rowActions]);

  // Table instance
  const table = useReactTable({
    data,
    columns: finalColumns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  // ---- total column count for colSpan calculations ----
  const totalCols = finalColumns.length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar: Search + Filters */}
      {(searchable || filters.length > 0) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable && onSearch && (
            <DataTableSearch
              value={searchValue}
              onSearch={onSearch}
              placeholder={searchPlaceholder}
            />
          )}
          {filters.length > 0 && onFilterChange && (
            <DataTableFilters
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={onFilterChange}
            />
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {/* Loading state */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={totalCols} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {!isLoading &&
              table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Empty state */}
            {!isLoading && table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={totalCols} className="h-48">
                  <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                    <FileX2 className="h-10 w-10 opacity-40" />
                    <p className="text-base font-medium">{emptyTitle}</p>
                    <p className="text-sm">{emptyDescription}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginationMeta && onPageChange && onPageSizeChange && (
        <DataTablePagination
          meta={paginationMeta}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
