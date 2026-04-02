import { UserRole } from "@/lib/authUtils"
import { UserStatus } from "./user.types"




export interface ITeacher {
    id: string,
    email: string,
    name: string,
    emailVerified: boolean,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    role: UserRole,
    status: UserStatus,
    needPasswordChange: boolean,
    isDeleted: boolean,
    loginAttempts: number,
    lockUntil: string | null,
    teacher: {
                id: string,
                userId: string,
                phone: string,
                image: string | null,
                specialization: string,
                qualification: string,
                joiningDate: string,
                bio: string | null
            }
}