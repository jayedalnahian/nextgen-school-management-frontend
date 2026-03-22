import { UserRole } from "@/lib/authUtils";

export type User = {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    needPasswordChange: boolean;
    name?: string;
    status: string;
};
