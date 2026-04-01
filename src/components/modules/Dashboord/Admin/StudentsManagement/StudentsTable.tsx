"use client";

import DataTable from "@/components/shared/data-table/DataTable";
import { getStudents } from "@/services/student.service";
import { getClasses } from "@/services/class.service";
import { getParents } from "@/services/parent.service";
import { IStudent, IClass } from "@/types/student.types";
import { IParent } from "@/types/parent.types";
import { useQuery } from "@tanstack/react-query";
import { studentsColumns } from "./StudentsColumn";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTableFilters, serverManagedFilter, ServerManagedFilterDefinition } from "@/hooks/useServerManagedDataTableFilters";
import { useState, useMemo } from "react";
import { StudentEditModal } from "@/components/shared/StudentEditModal";
import { StudentViewModal } from "@/components/shared/StudentViewModal";
import { DataTableFilterConfig } from "@/components/shared/data-table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const StudentsTable = ({
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

  // Fetch classes for filter dropdown
  const { data: classesResponse } = useQuery({
    queryKey: ["classes"],
    queryFn: () => getClasses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch parents for filter dropdown
  const { data: parentsResponse } = useQuery({
    queryKey: ["parents-for-filter"],
    queryFn: () => getParents(""),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const classes: IClass[] = classesResponse?.data || [];
  const parents: IParent[] = parentsResponse?.data || [];

  // State for edit modal
  const [editingStudent, setEditingStudent] = useState<IStudent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for view modal
  const [viewingStudent, setViewingStudent] = useState<IStudent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Filter definitions
  const filterDefinitions = useMemo<ServerManagedFilterDefinition[]>(() => {
    return [
      serverManagedFilter.single("classId"),
      serverManagedFilter.single("parentId"),
    ];
  }, []);

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: filterDefinitions,
      updateParams,
    });

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    const classOptions = classes.map((cls) => ({
      label: `${cls.name} ${cls.section ? `- ${cls.section}` : ""}`,
      value: cls.id,
    }));

    const parentOptions = parents.map((parent) => ({
      label: parent.name || parent.email,
      value: parent.parent?.id || parent.id,
    }));

    return [
      {
        id: "classId",
        label: "Class",
        type: "single-select",
        options: classOptions,
      },
      {
        id: "parentId",
        label: "Parent",
        type: "single-select",
        options: parentOptions,
      },
    ];
  }, [classes, parents]);

  // Handler for opening edit modal
  const handleEdit = (student: IStudent) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  // Handler for closing edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  // Handler for view modal
  const handleView = (student: IStudent) => {
    setViewingStudent(student);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingStudent(null);
  };





  const { data: studentDataResponse, isLoading } = useQuery({
    queryKey: ["students", queryString],
    queryFn: () => getStudents(queryString),
  });

  const { data: students } = studentDataResponse || { data: [] };

  return (
    <div>
      <DataTable
        data={students}
        meta={studentDataResponse?.meta}
        columns={studentsColumns}
        isLoading={isLoading}
        emptyMessage="No student found."
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
          placeholder: "Search student by name, class name...",
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
        }}
      />

      {/* Student Edit Modal */}
      {editingStudent && (
        <StudentEditModal
          student={editingStudent}
          classes={classes}
          parents={parents}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={() => {
            handleCloseEditModal();
          }}
        />
      )}

      {/* Student View Modal */}
      {viewingStudent && (
        <StudentViewModal
          student={viewingStudent}
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
        />
      )}
    </div>
  );
};

export default StudentsTable;
