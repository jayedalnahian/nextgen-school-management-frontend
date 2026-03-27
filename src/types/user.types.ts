import { UserRole } from "@/lib/authUtils";

export interface BaseProfile {
    id: string;
    userId: string;
    image: string | null;
}

export interface TeacherProfile extends BaseProfile {
    phone: string | null;
    specialization: string | null;
    qualification: string | null;
    joiningDate: string | null;
    bio: string | null;
}

export interface SuperAdminProfile extends BaseProfile {
    name: string | null;
    email: string | null;
    designation: string | null;
    phone: string | null;
    joiningDate: string | null;
    isDeleted?: boolean;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ParentProfile extends BaseProfile {
    phone: string | null;
    address: string | null;
    occupation: string | null;
    stripeCustomerId: string | null;
}

export type UserProfile = TeacherProfile | SuperAdminProfile | ParentProfile | Record<string, any>;

export type User = {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    emailVerified: boolean;
    needPasswordChange: boolean;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    image?: string | null;
    profile?: UserProfile;
    isDeleted?: boolean;
    deletedAt?: string | null;
    loginAttempts?: number;
    lockUntil?: string | null;
};
