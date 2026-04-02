import { IClass } from "@/types/class.types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, BookOpen, DollarSign } from "lucide-react";
import { ClassActionsDropdown } from "./ClassActionsDropdown";

export const classesColumns: ColumnDef<IClass>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Class Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.name}</span>
        <span className="text-muted-foreground text-xs font-mono">{row.original.id}</span>
      </div>
    ),
  },
  {
    id: "section",
    accessorKey: "section",
    header: "Section",
    enableSorting: false,
    cell: ({ row }) => {
      const section = row.original.section;
      return section ? (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {section}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "monthlyFee",
    accessorKey: "monthlyFee",
    header: "Monthly Fee",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm">${row.original.monthlyFee.toFixed(2)}</span>
      </div>
    ),
  },
  {
    id: "capacity",
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.capacity ? `${row.original.capacity} students` : "Unlimited"}
      </span>
    ),
  },
  {
    id: "students",
    accessorKey: "_count.students",
    header: "Students",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Users className="h-4 w-4 text-muted-foreground" />
        <Badge variant="secondary" className="font-mono">
          {row.original._count?.students || 0}
        </Badge>
      </div>
    ),
  },
  {
    id: "teachers",
    accessorKey: "_count.teachers",
    header: "Teachers",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
        <Badge variant="secondary" className="font-mono">
          {row.original._count?.teachers || 0}
        </Badge>
      </div>
    ),
  },
  {
    id: "subjects",
    accessorKey: "_count.subjects",
    header: "Subjects",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <Badge variant="secondary" className="font-mono">
          {row.original._count?.subjects || 0}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <ClassActionsDropdown
          classData={row.original}
          onViewDetails={(data) => console.log("View class details:", data)}
          onEditClass={(data) => console.log("Edit class:", data)}
          onViewAssignedTeachers={(data) => console.log("View assigned teachers:", data)}
          onAssignTeacher={(data) => console.log("Assign teacher:", data)}
          onViewAssignedStudents={(data) => console.log("View assigned students:", data)}
          onAssignStudent={(data) => console.log("Assign student:", data)}
          onViewAssignedSubjects={(data) => console.log("View assigned subjects:", data)}
          onAssignSubject={(data) => console.log("Assign subject:", data)}
        />
      );
    },
  },
];
