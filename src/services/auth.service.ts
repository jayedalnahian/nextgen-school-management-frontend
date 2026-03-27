"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import {
  fetchForgotPassword,
  fetchLogin,
  fetchMe,
  fetchNewTokens,
  fetchResendVerificationEmail,
  fetchResetPassword,
} from "./auth-api";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string; token: string } | null> {
  try {
    const res = await fetchNewTokens(refreshToken);

    if (!res.ok) {
      return null;
    }

    const { data } = await res.json();
    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken) {
      try { await setTokenInCookies("accessToken", accessToken); } catch (e) { /* ignore edge error */ }
    }
    if (newRefreshToken) {
      try { await setTokenInCookies("refreshToken", newRefreshToken); } catch (e) { /* ignore edge error */ }
    }
    if (token) {
      try { await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); } catch (e) { /* ignore edge error */ }
    }

    return { accessToken, refreshToken: newRefreshToken, token };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export async function loginUser(payload: any) {
  try {
    const res = await fetchLogin(payload);

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Login failed",
        error: result,
      };
    }

    const { accessToken, refreshToken, token } = result.data;

    if (accessToken) {
      await setTokenInCookies("accessToken", accessToken);
    }

    if (refreshToken) {
      await setTokenInCookies("refreshToken", refreshToken);
    }

    if (token) {
      await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function forgotPassword(payload: { email: string }) {
  try {
    const res = await fetchForgotPassword(payload.email);

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to send reset link",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function resendVerificationEmail(payload: { email: string }) {
  try {
    const res = await fetchResendVerificationEmail(payload.email);

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to resend verification email",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Resend verification email error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function resetPassword(payload: any) {
  try {
    const res = await fetchResetPassword(payload);

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to reset password",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function getUserInfo(customCookieHeader?: string) {
  let cookieHeader = customCookieHeader;

  if (!cookieHeader) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken || !sessionToken) {
      return null;
    }

    cookieHeader = [
      `accessToken=${accessToken}`,
      `better-auth.session_token=${sessionToken}`,
      refreshToken ? `refreshToken=${refreshToken}` : "",
    ]
      .filter(Boolean)
      .join("; ");
  }

  const res = await fetch(`${BASE_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const { data } = await res.json();

  return data;
}
