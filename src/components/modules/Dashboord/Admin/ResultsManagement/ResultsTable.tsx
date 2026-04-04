"use client";

import DataTable from "@/components/shared/data-table/DataTable";
import { getResults } from "@/services/result.service";
import { IResult } from "@/types/result.types";
import { useQuery } from "@tanstack/react-query";
import { resultsColumns } from "./ResultsColumn";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTableFilters, serverManagedFilter, ServerManagedFilterDefinition } from "@/hooks/useServerManagedDataTableFilters";
import { useMemo } from "react";
import { DataTableFilterConfig } from "@/components/shared/data-table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const ResultsTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  // Filter definitions
  const filterDefinitions = useMemo<ServerManagedFilterDefinition[]>(() => {
    return [
      serverManagedFilter.single("grade"),
    ];
  }, []);

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: filterDefinitions,
      updateParams,
    });

  const { data: resultDataResponse, isLoading } = useQuery({
    queryKey: ["results", queryString],
    queryFn: () => getResults(queryString as string),
  });

  const results = (resultDataResponse?.data || []) as IResult[];

  // Generate grade options for filter
  const gradeOptions = useMemo(() => {
    const grades = ["A+", "A", "B", "C", "D", "F"];
    return grades.map((grade) => ({
      label: grade,
      value: grade,
    }));
  }, []);

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: "grade",
        label: "Grade",
        type: "single-select",
        options: gradeOptions,
      },
    ];
  }, [gradeOptions]);

  // Dummy action handlers for now
  const handleView = (resultItem: IResult) => {
    console.log("View result:", resultItem);
  };

  const handleEdit = (resultItem: IResult) => {
    console.log("Edit result:", resultItem);
  };

  const handleDelete = (resultItem: IResult) => {
    console.log("Delete result:", resultItem);
  };

  return (
    <div>
      <DataTable
        data={results}
        meta={resultDataResponse?.meta}
        columns={resultsColumns}
        isLoading={isLoading}
        emptyMessage="No results found."
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange,
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange,
        }}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Search result by student name or ID...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        filters={{
          configs: filterConfigs,
          values: filterValues,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters,
        }}
        actions={{
          onEdit: handleEdit,
          onView: handleView,
          onDelete: handleDelete,
        }}
      />
    </div>
  );
};

export default ResultsTable;
