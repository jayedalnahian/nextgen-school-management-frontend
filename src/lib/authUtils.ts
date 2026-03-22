export type UserRole = "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "PARENT";

export const authRoutes = [ "/login", "/register", "/forget-password", "/verify-otp", "/reset-password" ];

export const isAuthRoute = (pathname : string) => {
    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : ["/my-profile", "/change-password"],
    pattern : []
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin/ ], 
    exact : []
}

export const teacherProtectedRoutes : RouteConfig = {
    pattern: [/^\/teacher/ ], 
    exact : []
}

export const parentProtectedRoutes : RouteConfig = {
    pattern: [/^\/parent/ ], 
    exact : []
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) : UserRole | "COMMON" | null => {
    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    if(isRouteMatches(pathname, teacherProtectedRoutes)) {
        return "TEACHER";
    }

    if(isRouteMatches(pathname, parentProtectedRoutes)) {
        return "PARENT";
    }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    if(role === "ADMIN" || role === "SUPER_ADMIN") {
        return "/admin";
    }
    if(role === "TEACHER") {
        return "/teacher";
    }
    if(role === "PARENT") {
        return "/parent";
    }

    return "/";
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
    const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

    const currentRole = unifySuperAdminAndAdminRole;

    const routeOwner = getRouteOwner(redirectPath);

    if(routeOwner === null || routeOwner === "COMMON"){
        return true;
    }

    if(routeOwner === currentRole){
        return true;
    }

    return false;
}