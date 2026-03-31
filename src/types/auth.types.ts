import { User } from "./user.types";
import { UserRole } from "@/lib/authUtils";

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    token: string;
    user: User;
    success?: boolean;
    message?: string;
}

// Base payload for all user types
export interface BaseRegisterPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  image?: File | null;
}

// Parent specific payload
export interface RegisterParentPayload extends BaseRegisterPayload {
  role: "PARENT";
  address: string;
  occupation: string;
}

// Teacher specific payload
export interface RegisterTeacherPayload extends BaseRegisterPayload {
  role: "TEACHER";
  specialization: string;
  qualification: string;
  joiningDate: string;
}

// Admin specific payload
export interface RegisterAdminPayload extends BaseRegisterPayload {
  role: "ADMIN";
  designation: string;
  joiningDate: string;
}

// Union type for all register payloads
export type RegisterPayload =
  | RegisterParentPayload
  | RegisterTeacherPayload
  | RegisterAdminPayload;
