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

export interface IParent {
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
  parent: {
    id: string;
    userId: string;
    phone: string | null;
    address: string | null;
    occupation: string | null;
    image: string | null;
    stripeCustomerId: string | null;
  };
}
