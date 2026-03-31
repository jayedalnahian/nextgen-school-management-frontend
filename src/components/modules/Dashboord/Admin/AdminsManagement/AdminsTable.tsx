"use client";

import DataTable from "@/components/shared/data-table/DataTable";
import { getAdmins } from "@/services/admin.service";
import { IAdmin } from "@/types/admin.types";
import { useQuery } from "@tanstack/react-query";
import { adminsColumns } from "./AdminsColumn";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTableFilters, serverManagedFilter, ServerManagedFilterDefinition } from "@/hooks/useServerManagedDataTableFilters";
import { useMemo } from "react";
import { DataTableFilterConfig } from "@/components/shared/data-table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminsTable = ({
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

  const handleView = (admin: IAdmin) => {
    console.log(admin);
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

  const handleEdit = (admin: IAdmin) => {
    console.log(admin);
  };

  const handleDelete = (admin: IAdmin) => {
    console.log(admin);
  };

  const { data: adminDataResponse, isLoading } = useQuery({
    queryKey: ["admins", queryString],
    queryFn: () => getAdmins(queryString),
  });

  const { data: admins } = adminDataResponse || { data: [] };

  return (
    <div>
      <DataTable
        data={admins}
        meta={adminDataResponse?.meta}
        columns={adminsColumns}
        isLoading={isLoading}
        emptyMessage="No admin found."
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
          placeholder: "Search admin by name, email...",
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

export default AdminsTable;
