/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse | undefined> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

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
      `/auth/login`,
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, needPasswordChange, email } = user;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

    if (needPasswordChange) {
      redirectTo = `/reset-password?email=${email}`;
    } else {
      redirectTo =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);

      console.log(redirectTo, "redirectTo");
    }
  } catch (error: any) {
    console.log(error, "error");

    if (
      error &&
      error.response &&
      error.response.data.message === "Email not verified"
    ) {
      redirectTo = `/verify-email?email=${payload.email}`;
    } else {
      return {
        success: false,
        message: `Login failed: ${error.response?.data?.message || error.message}`,
      };
    }
  }


    redirect(redirectTo || "/");
};
