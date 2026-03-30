"use client";

import DataTable from "@/components/shared/data-table/DataTable";
import { getTeachers } from "@/services/teacher.service";
import { ITeacher } from "@/types/teacher.types";
import { useQuery } from "@tanstack/react-query";
import { teachersColumns } from "./TeachersColumn";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTableFilters, serverManagedFilter, ServerManagedFilterDefinition } from "@/hooks/useServerManagedDataTableFilters";
import { useMemo } from "react";
import { DataTableFilterConfig } from "@/components/shared/data-table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const TeachersTable = ({
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

  const filterDefinitions = useMemo<ServerManagedFilterDefinition[]>(() => {
    return [
      serverManagedFilter.single("status"),
    ];
  }, []);

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: filterDefinitions,
      updateParams,
    });
  const handleView = (teacher: ITeacher) => {
    console.log(teacher);
  };

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
      return [
        {
          id: "status",
          label: "Status",
          type: "single-select",
          options: [
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
            { label: "Suspended", value: "SUSPENDED" },
          ], 
        },
      ];
    }, []);


  const handleEdit = (teacher: ITeacher) => {
    console.log(teacher);
  };

  const handleDelete = (teacher: ITeacher) => {
    console.log(teacher);
  };

  const { data: teacherDataResponse, isLoading } = useQuery({
    queryKey: ["teachers", queryString],
    queryFn: () => getTeachers(queryString),
  });

  

  const { data: teachers } = teacherDataResponse || { data: [] };

  return (
    <div>
      <DataTable
        data={teachers}
        meta={teacherDataResponse?.meta}
        columns={teachersColumns}
        isLoading={isLoading}
        emptyMessage="No teacher found."
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
          placeholder: "Search teacher by name, email...",
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
      ></DataTable>
    </div>
  );
};

export default TeachersTable;
