"use client";

import DataTable from "@/components/shared/data-table/DataTable";
import { getParents } from "@/services/parent.service";
import { IParent } from "@/types/parent.types";
import { useQuery } from "@tanstack/react-query";
import { parentsColumns } from "./ParentsColumn";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTableFilters, serverManagedFilter, ServerManagedFilterDefinition } from "@/hooks/useServerManagedDataTableFilters";
import { useMemo } from "react";
import { DataTableFilterConfig } from "@/components/shared/data-table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const ParentsTable = ({
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
      serverManagedFilter.single("emailVerified"),
    ];
  }, []);

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: filterDefinitions,
      updateParams,
    });

  const handleView = (parent: IParent) => {
    console.log(parent);
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
      {
        id: "emailVerified",
        label: "Verified",
        type: "single-select",
        options: [
          { label: "Verified", value: "true" },
          { label: "Not Verified", value: "false" },
        ],
      },
    ];
  }, []);

  const handleEdit = (parent: IParent) => {
    console.log(parent);
  };

  const handleDelete = (parent: IParent) => {
    console.log(parent);
  };

  const { data: parentDataResponse, isLoading } = useQuery({
    queryKey: ["parents", queryString],
    queryFn: () => getParents(queryString),
  });

  const { data: parents } = parentDataResponse || { data: [] };

  return (
    <div>
      <DataTable
        data={parents}
        meta={parentDataResponse?.meta}
        columns={parentsColumns}
        isLoading={isLoading}
        emptyMessage="No parent found."
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
          placeholder: "Search parent by name, email, phone, address, stripe ID...",
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

export default ParentsTable;
