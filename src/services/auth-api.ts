const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  // We can't throw here if it's imported in edge runtime and env is missing, 
  // but it should be defined in the project.
}

export async function fetchNewTokens(refreshToken: string) {
  return await fetch(`${BASE_API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${refreshToken}`,
    },
  });
}

export async function fetchMe(allCookies: string) {
  return await fetch(`${BASE_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: allCookies,
    },
  });
}

export async function fetchLogin(payload: any) {
  return await fetch(`${BASE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchForgotPassword(email: string) {
  return await fetch(`${BASE_API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}

export async function fetchResetPassword(payload: any) {
  return await fetch(`${BASE_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchResendVerificationEmail(email: string) {
  return await fetch(`${BASE_API_URL}/auth/resend-verification-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}
