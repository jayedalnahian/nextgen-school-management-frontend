import { IStudent } from "@/types/student.types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const studentsColumns: ColumnDef<IStudent>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.name}</span>
        <span className="text-muted-foreground text-xs">{row.original.studentID}</span>
      </div>
    ),
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Gender",
    enableSorting: false,
    cell: ({ row }) => {
      const gender = row.original.gender;
      return (
        <Badge variant="outline" className="capitalize">
          {gender?.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    id: "class.name",
    accessorKey: "class.name",
    header: "Class",
    cell: ({ row }) => {
      const className = row.original.class?.name;
      const section = row.original.class?.section;
      return (
        <span className="text-sm text-muted-foreground">
          {className ? `${className} ${section ? `- ${section}` : ""}` : "-"}
        </span>
      );
    },
  },
  {
    id: "parent.phone",
    accessorKey: "parent.phone",
    header: "Parent Phone",
    enableSorting: false,
    cell: ({ row }) => {
      const phone = row.original.parent?.phone;
      return <span className="text-sm text-muted-foreground">{phone || "-"}</span>;
    },
  },
];
