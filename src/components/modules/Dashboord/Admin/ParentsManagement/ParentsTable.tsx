"use client";

import { useState } from "react";
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
import { UserEditModal } from "@/components/shared/UserEditModal";
import { UserViewModal } from "@/components/shared/UserViewModal";
import { UserDeleteModal } from "@/components/shared/UserDeleteModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const ParentsTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();
  const [editingUser, setEditingUser] = useState<IParent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<IParent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<IParent | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    setViewingUser(parent);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingUser(null);
  };

  const handleEdit = (parent: IParent) => {
    setEditingUser(parent);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (parent: IParent) => {
    setDeletingUser(parent);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
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

  const { data: parentDataResponse, isLoading } = useQuery({
    queryKey: ["parents", queryString],
    queryFn: () => getParents(queryString),
  });

  const { data: parents } = parentDataResponse || { data: [] };

  // Convert IParent to IUser format for UserEditModal
  const userForEditModal = editingUser
    ? {
        id: editingUser.id,
        email: editingUser.email,
        name: editingUser.name,
        image: editingUser.image,
        role: editingUser.role as "ADMIN" | "TEACHER" | "PARENT" | "SUPER_ADMIN",
        status: editingUser.status,
        emailVerified: editingUser.emailVerified,
        createdAt: editingUser.createdAt,
        updatedAt: editingUser.updatedAt,
        parent: editingUser.parent,
      }
    : null;

  // Convert IParent to IUser format for UserViewModal
  const userForViewModal = viewingUser
    ? {
        id: viewingUser.id,
        email: viewingUser.email,
        name: viewingUser.name,
        image: viewingUser.image,
        role: viewingUser.role as "ADMIN" | "TEACHER" | "PARENT" | "SUPER_ADMIN",
        status: viewingUser.status,
        emailVerified: viewingUser.emailVerified,
        createdAt: viewingUser.createdAt,
        updatedAt: viewingUser.updatedAt,
        parent: viewingUser.parent,
      }
    : null;

  // Convert IParent to IUser format for UserDeleteModal
  const userForDeleteModal = deletingUser
    ? {
        id: deletingUser.id,
        email: deletingUser.email,
        name: deletingUser.name,
        role: deletingUser.role as "ADMIN" | "TEACHER" | "PARENT" | "SUPER_ADMIN",
      }
    : null;

  return (
    <div>
      {userForViewModal && (
        <UserViewModal
          user={userForViewModal}
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
        />
      )}
      {userForEditModal && (
        <UserEditModal
          user={userForEditModal}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={() => {
            handleCloseEditModal();
          }}
        />
      )}
      {userForDeleteModal && (
        <UserDeleteModal
          user={userForDeleteModal}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onSuccess={() => {
            handleCloseDeleteModal();
          }}
        />
      )}
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
