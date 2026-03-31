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

export interface IAdmin {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
  status: UserStatus;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  loginAttempts: number;
  lockUntil: string | null;
  admin: {
    id: string;
    userId: string;
    name: string | null;
    email: string | null;
    designation: string | null;
    phone: string | null;
    joiningDate: string | null;
    image: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
