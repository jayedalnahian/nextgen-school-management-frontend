import { getCookie } from "@/lib/cookieUtils";
import { jwtUtils } from "@/lib/jwtUtils";
import { type UserRole } from "@/lib/authUtils";
import { Navbar, type NavbarAuthState } from "./Navbar";
import { deleteCookie } from "@/lib/cookieUtils";

/**
 * Server component that reads the accessToken cookie,
 * decodes the user's role/name/email, and passes
 * the auth state down to the client Navbar.
 *
 * Usage in your layout:
 *   <NavbarWrapper />
 */
export default async function NavbarWrapper() {
  const accessToken = await getCookie("accessToken");

  let auth: NavbarAuthState = { isLoggedIn: false };

  if (accessToken) {
    const decoded = jwtUtils.decodeToken(accessToken);
   
    if (decoded) {
      const rawRole = (decoded.role as UserRole) ?? "ADMIN";
     
      auth = {
        isLoggedIn: true,
        role: rawRole === "SUPER_ADMIN" ? "ADMIN" : rawRole,
        name: (decoded.name as string) ?? undefined,
        email: (decoded.email as string) ?? undefined,
      };
     
    }
  }

  const handleLogout = async () => {
    "use server";
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
  };

  return <Navbar auth={auth} onLogout={handleLogout} />;
}
