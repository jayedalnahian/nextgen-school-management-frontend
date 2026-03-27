import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";

import {
  getNewTokensWithRefreshToken,
  getUserInfo,
} from "./services/auth.service";
import { fetchForgotPassword } from "./services/auth-api";

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

function shouldRedirect(request: NextRequest, targetPath: string) {
  const { pathname } = request.nextUrl;
  return pathname !== targetPath;
}

async function refreshTokenMiddleware(
  request: NextRequest,
  refreshToken: string,
): Promise<NextResponse | null> {
  try {
    const data = await getNewTokensWithRefreshToken(refreshToken);
    if (!data) return null;

    const response = NextResponse.next();

    // Sync cookies to the response so the browser receives them immediately
    if (data.accessToken) {
      response.cookies.set("accessToken", data.accessToken);
    }
    if (data.refreshToken) {
      response.cookies.set("refreshToken", data.refreshToken);
    }
    if (data.token) {
      response.cookies.set("better-auth.session_token", data.token, {
        maxAge: 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname, searchParams } = request.nextUrl;

    // 1. Path Bypass: Immediately skip for static assets and internal Next.js routes
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/static") ||
      pathname.includes(".") // Covers favicon.ico, images, etc.
    ) {
      return NextResponse.next();
    }

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;

    const pathWithQuery = `${pathname}${request.nextUrl.search}`;

    const decodedAccessToken =
      accessToken && jwtUtils.verifyToken(accessToken, JWT_ACCESS_SECRET).data;

    const isValidAccessToken =
      accessToken &&
      jwtUtils.verifyToken(accessToken, JWT_ACCESS_SECRET).success;

    let userRole: UserRole | null = null;
    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // 2. Proactive Token Refresh
    if (
      accessToken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken))
    ) {
      const refreshResponse = await refreshTokenMiddleware(
        request,
        refreshToken,
      );
      if (refreshResponse) {
        return refreshResponse;
      }
    }

    // 3. Authenticated Users on Auth Routes
    if (isAuth && isValidAccessToken) {
      if (pathname === "/verify-email" || pathname === "/reset-password") {
        // Fall through to status checks
      } else {
        const dashboard = getDefaultDashboardRoute(userRole as UserRole);
        if (shouldRedirect(request, dashboard)) {
          return NextResponse.redirect(new URL(dashboard, request.url));
        }
        return NextResponse.next();
      }
    }

    // 4. Handle Public Routes
    if (routerOwner === null) {
      return NextResponse.next();
    }

    // 5. Unauthenticated Access to Protected Routes
    if (!isValidAccessToken) {
      if (isAuth) return NextResponse.next();

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // 6. Role-based Access Control (RBAC)
    const effectiveRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;
    if (
      routerOwner !== "COMMON" &&
      routerOwner !== effectiveRole &&
      userRole !== "SUPER_ADMIN"
    ) {
      const dashboard = getDefaultDashboardRoute(userRole as UserRole);
      if (shouldRedirect(request, dashboard)) {
        return NextResponse.redirect(new URL(dashboard, request.url));
      }
    }

    // 7. Status Enforcement (Email Verification & Password Change)
    if (isValidAccessToken) {
      const allCookies = request.cookies
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

      const userInfo = await getUserInfo(allCookies);

      if (userInfo) {
        // Email Verification Check
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }
          return NextResponse.next();
        }

        // Redirect away from verify-email if already verified
        if (userInfo.emailVerified && pathname === "/verify-email") {
          const dashboard = getDefaultDashboardRoute(userRole as UserRole);
          return NextResponse.redirect(new URL(dashboard, request.url));
        }

        // Password Change Check
        if (userInfo.needPasswordChange) {
          if (pathname !== "/reset-password") {
            try {
              await fetchForgotPassword(userInfo.email);
            } catch (e) {
              console.error("Auto OTP send failed in middleware:", e);
            }
            const resetPasswordUrl = new URL("/reset-password", request.url);
            resetPasswordUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(resetPasswordUrl);
          }
          return NextResponse.next();
        }

        // Redirect away from reset-password if not needed
        if (
          !userInfo.needPasswordChange &&
          pathname === "/reset-password" &&
          !searchParams.get("token")
        ) {
          const dashboard = getDefaultDashboardRoute(userRole as UserRole);
          return NextResponse.redirect(new URL(dashboard, request.url));
        }
      } else {
        const loginUrl = new URL("/login", request.url);
        if (!isAuth) {
          loginUrl.searchParams.set("redirect", pathWithQuery);
        }
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        response.cookies.delete("better-auth.session_token");
        return response;
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
