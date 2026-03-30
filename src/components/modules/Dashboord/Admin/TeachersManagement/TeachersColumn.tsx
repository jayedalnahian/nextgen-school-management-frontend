import QualificationCell from "@/components/shared/cell/QualificationCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import VerifiedBadgeCell from "@/components/shared/cell/VerifiedBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ITeacher } from "@/types/teacher.types";
import { ColumnDef } from "@tanstack/react-table";

export const teachersColumns: ColumnDef<ITeacher>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => (
                <UserInfoCell name={row.original.name} email={row.original.email} profilePhoto={row.original.image || undefined} />
            )
                
        },
        {
            id: "teacher.qualification",
            accessorKey: "qualification",
            header: "Qualification",
            cell: ({row}) => {
                const qualification = row.original.teacher?.qualification;
                return (
                    <QualificationCell qualification={qualification} />
                );
            }
        },
        {
            id: "teacher.specialization",
            accessorKey: "specialization",
            header: "Specialization",
            cell: ({row}) => {
                const specialization = row.original.teacher?.specialization;
                return (
                    <QualificationCell qualification={specialization} />
                );
            }
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Status",
            enableSorting : false,
            cell: ({row}) => {
                const status = row.original.status;
                return (
                    <StatusBadgeCell status={status} />
                );
            }
        },
        {
            id: "emailVerified",
            accessorKey: "emailVerified",
            header: "Verified",
            enableSorting : false,
            cell: ({row}) => {
                const emailVerified = row.original.emailVerified;
                return (
                    <VerifiedBadgeCell isVerified={emailVerified} />
                );
            }
        } 
    ]; 
