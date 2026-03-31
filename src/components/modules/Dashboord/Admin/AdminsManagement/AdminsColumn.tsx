import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import VerifiedBadgeCell from "@/components/shared/cell/VerifiedBadgeCell";
import { IAdmin } from "@/types/admin.types";
import { ColumnDef } from "@tanstack/react-table";

export const adminsColumns: ColumnDef<IAdmin>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        profilePhoto={row.original.image || undefined}
      />
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusBadgeCell status={status} />;
    },
  },
  {
    id: "emailVerified",
    accessorKey: "emailVerified",
    header: "Verified",
    enableSorting: false,
    cell: ({ row }) => {
      const emailVerified = row.original.emailVerified;
      return <VerifiedBadgeCell isVerified={emailVerified} />;
    },
  },
  {
    id: "admin.phone",
    accessorKey: "admin.phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.admin?.phone;
      return <span className="text-sm text-muted-foreground">{phone || "-"}</span>;
    },
  },
  {
    id: "admin.designation",
    accessorKey: "admin.designation",
    header: "Designation",
    cell: ({ row }) => {
      const designation = row.original.admin?.designation;
      return (
        <span className="text-sm text-muted-foreground">
          {designation || "-"}
        </span>
      );
    },
  },
  {
    id: "admin.joiningDate",
    accessorKey: "admin.joiningDate",
    header: "Joining Date",
    cell: ({ row }) => {
      const joiningDate = row.original.admin?.joiningDate;
      if (!joiningDate) return <span className="text-sm text-muted-foreground">-</span>;
      return (
        <span className="text-sm text-muted-foreground">
          {new Date(joiningDate).toLocaleDateString()}
        </span>
      );
    },
  },
];
