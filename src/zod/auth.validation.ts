import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const loginSchema = loginZodSchema;

// Base registration schema
export const baseRegisterSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
});

// Parent registration schema
export const registerParentSchema = baseRegisterSchema.extend({
  role: z.literal("PARENT"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  occupation: z.string().min(2, "Occupation must be at least 2 characters"),
});

// Teacher registration schema
export const registerTeacherSchema = baseRegisterSchema.extend({
  role: z.literal("TEACHER"),
  specialization: z.string().min(2, "Specialization must be at least 2 characters"),
  qualification: z.string().min(2, "Qualification must be at least 2 characters"),
  joiningDate: z.string().min(1, "Joining date is required"),
});

// Admin registration schema
export const registerAdminSchema = baseRegisterSchema.extend({
  role: z.literal("ADMIN"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  joiningDate: z.string().min(1, "Joining date is required"),
});

// Union type for all register schemas
export const registerSchema = z.union([
  registerParentSchema,
  registerTeacherSchema,
  registerAdminSchema,
]);

export type IRegisterParentPayload = z.infer<typeof registerParentSchema>;
export type IRegisterTeacherPayload = z.infer<typeof registerTeacherSchema>;
export type IRegisterAdminPayload = z.infer<typeof registerAdminSchema>;
export type IRegisterPayload = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export type IForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
  .refine((val) => !val.includes(" "), {
    message: "Password must not contain spaces",
  })
});

export type IResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
