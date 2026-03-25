import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const loginSchema = loginZodSchema;

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});
