import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import VerifiedBadgeCell from "@/components/shared/cell/VerifiedBadgeCell";
import { IParent } from "@/types/parent.types";
import { ColumnDef } from "@tanstack/react-table";

export const parentsColumns: ColumnDef<IParent>[] = [
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
    id: "parent.phone",
    accessorKey: "parent.phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.parent?.phone;
      return <span className="text-sm text-muted-foreground">{phone || "-"}</span>;
    },
  },
  {
    id: "parent.stripeCustomerId",
    accessorKey: "parent.stripeCustomerId",
    header: "Stripe ID",
    cell: ({ row }) => {
      const stripeId = row.original.parent?.stripeCustomerId;
      return (
        <span className="text-sm text-muted-foreground font-mono">
          {stripeId || "-"}
        </span>
      );
    },
  },
  {
    id: "parent.address",
    accessorKey: "parent.address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.parent?.address;
      return (
        <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
          {address || "-"}
        </span>
      );
    },
  },
];
