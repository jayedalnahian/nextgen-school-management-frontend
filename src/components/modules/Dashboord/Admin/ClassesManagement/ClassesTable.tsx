"use client";

import DataTable from "@/components/shared/data-table/DataTable";
import { getClasses } from "@/services/class.service";
import { IClass } from "@/types/class.types";
import { useQuery } from "@tanstack/react-query";
import { classesColumns } from "./ClassesColumn";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTableFilters, serverManagedFilter, ServerManagedFilterDefinition } from "@/hooks/useServerManagedDataTableFilters";
import { useMemo } from "react";
import { DataTableFilterConfig } from "@/components/shared/data-table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const ClassesTable = ({
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
      serverManagedFilter.single("section"),
    ];
  }, []);

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: filterDefinitions,
      updateParams,
    });

  // Fetch all classes for section filter dropdown
  const { data: allClassesResponse } = useQuery({
    queryKey: ["classes-all"],
    queryFn: () => getClasses({ limit: "100" }),
    staleTime: 1000 * 60 * 5,
  });

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    // Extract unique sections from all classes
    const allClasses = (allClassesResponse?.data || []) as IClass[];
    const sections = [...new Set(allClasses.map((cls) => cls.section).filter(Boolean))];

    const sectionOptions = sections.map((section) => ({
      label: section as string,
      value: section as string,
    }));

    return [
      {
        id: "section",
        label: "Section",
        type: "single-select",
        options: sectionOptions,
      },
    ];
  }, [allClassesResponse]);

  // Dummy action handlers for now
  const handleView = (classItem: IClass) => {
    console.log("View class:", classItem);
  };

  const handleEdit = (classItem: IClass) => {
    console.log("Edit class:", classItem);
  };

  const { data: classDataResponse, isLoading } = useQuery({
    queryKey: ["classes", queryString],
    queryFn: () => getClasses(queryString as string),
  });

  const classes = (classDataResponse?.data || []) as IClass[];

  return (
    <div>
      <DataTable
        data={classes}
        meta={classDataResponse?.meta}
        columns={classesColumns}
        isLoading={isLoading}
        emptyMessage="No classes found."
        enableHardcodedActions={false}
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
          placeholder: "Search class by name or ID...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        filters={{
          configs: filterConfigs,
          values: filterValues,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters,
        }}
      />
    </div>
  );
};

export default ClassesTable;
