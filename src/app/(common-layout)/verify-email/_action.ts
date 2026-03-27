"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import z from "zod";
import { redirect } from "next/navigation";
import { forgotPassword } from "@/services/auth.service";

const verifyEmailZodSchema = z.object({
  otp: z.string().min(6, "Code must be at least 6 characters long"),
  email: z.email("Invalid email address"),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const verifyEmailAction = async (
  payload: {
    otp: string;
    email: string;
  },
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse | undefined> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }
  let redirectTo: string | null = null;

  try {
    const response = await httpClient.post<ILoginResponse>(
      `/auth/verify-email`,
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, needPasswordChange, email, emailVerified } = user;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
    if (!emailVerified) {
      redirectTo = `/verify-email?email=${email}`;
    } else if (needPasswordChange) {
      await forgotPassword({ email });
      redirectTo = `/reset-password?email=${email}`;
    } else {
      redirectTo =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);
    }
  } catch (error: any) {
    // console.log(error, "error");

    if (
      error &&
      error.response &&
      error.response.data.message === "Email not verified"
    ) {
      redirectTo = `/verify-email?email=${payload.email}`;
    } else {
      return {
        success: false,
        message: `Verification failed: ${error.response?.data?.message || error.message}`,
      };
    }
  }

  redirect(redirectTo || "/");
};

export const resendOTPAction = async (payload: {
  email: string;
}): Promise<
  { success: boolean; message: string } | ApiErrorResponse | undefined
> => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    // Better-Auth is mounted at /api/auth, while our API is at /api/v1
    const betterAuthUrl = apiBaseUrl.replace("/api/v1", "/api/auth");

    const response = await fetch(`${betterAuthUrl}/send-verification-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: payload.email,
        callbackURL: "/", // callbackURL is required by Better-Auth but we use OTP
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to resend verification email",
      };
    }

    return {
      success: true,
      message: "Verification code resent successfully",
    };
  } catch (error: any) {
    // console.log(error, "error resending otp");
    return {
      success: false,
      message: `Resend failed: ${error.message}`,
    };
  }
};
