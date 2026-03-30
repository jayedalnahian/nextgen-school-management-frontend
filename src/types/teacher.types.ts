
enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  PARENT = "PARENT"
}

enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
}



export interface ITeacher {
    id: string,
    email: string,
    name: string,
    emailVerified: boolean,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    role: Role,
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