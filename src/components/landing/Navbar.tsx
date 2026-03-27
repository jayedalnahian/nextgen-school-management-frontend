"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { getDefaultDashboardRoute, type UserRole } from "@/lib/authUtils";

// ============================================================================
// Types
// ============================================================================

export interface NavbarAuthState {
  /** Whether the user is authenticated */
  isLoggedIn: boolean;
  /** User role for dashboard routing */
  role?: UserRole;
  /** Display name for avatar/dropdown */
  name?: string;
  /** Email for the dropdown */
  email?: string;
}

interface NavbarProps {
  auth: NavbarAuthState;
  /** Project brand name */
  brandName?: string;
  /** Logout server action or handler */
  onLogout?: () => void | Promise<void>;
}

// ============================================================================
// Constants
// ============================================================================

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// ============================================================================
// Navbar
// ============================================================================

export function Navbar({
  auth,
  brandName = "NextGen School",
  onLogout,
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ---- Scroll listener for glassmorphism effect ----
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll(); // initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardRoute = auth.role ? getDefaultDashboardRoute(auth.role) : "/";

  // console.log(dashboardRoute, "dashboardRoute")

  const initials = auth.name
    ? auth.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // ---- Helper: is a nav link active? ----
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.replace(/#.*$/, ""));
  };

  // ---- Shared link renderer ----
  const renderNavLinks = (mobile = false) =>
    NAV_LINKS.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={mobile ? () => setMobileOpen(false) : undefined}
        className={cn(
          "text-sm font-medium transition-colors",
          mobile ? "block px-3 py-2.5 rounded-md" : "relative px-1 py-2",
          isActive(link.href)
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
          // Desktop active underline
          !mobile &&
            isActive(link.href) &&
            "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary",
          // Mobile active bg
          mobile && isActive(link.href) && "bg-primary/10",
        )}
      >
        {link.label}
      </Link>
    ));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/70 backdrop-blur-xl shadow-sm supports-backdrop-filter:bg-background/60"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---- Logo ---- */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">{brandName}</span>
        </Link>

        {/* ---- Desktop Nav ---- */}
        <nav className="hidden md:flex items-center gap-6">
          {renderNavLinks()}
        </nav>

        {/* ---- Desktop Actions ---- */}
        <div className="hidden md:flex items-center gap-3">
          {auth.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-muted p-1 transition-colors">
                    <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 transition-all hover:border-primary/50">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start mr-1 text-[11px] leading-tight">
                      <span className="font-semibold text-foreground truncate max-w-[80px]">
                        {auth.name?.split(" ")[0]}
                      </span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1">
                  <div className="px-3 py-2 rounded-md bg-muted/50 mb-1">
                    <p className="text-sm font-bold">{auth.name ?? "User"}</p>
                    {auth.email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {auth.email}
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardRoute} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                  {onLogout && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onLogout}
                        className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>

        {/* ---- Mobile Menu Trigger ---- */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] p-0">
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="h-4 w-4" />
                </div>
                {brandName}
              </SheetTitle>
            </SheetHeader>

            <Separator />

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1 px-4 py-4">
              {renderNavLinks(true)}
            </nav>

            <Separator />

            {/* Mobile Auth Actions */}
            <div className="px-4 py-4 space-y-3">
              {auth.isLoggedIn ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {auth.name ?? "User"}
                      </p>
                      {auth.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {auth.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={dashboardRoute}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/help">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </Link>
                  </Button>

                  {onLogout && (
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => {
                        onLogout();
                        setMobileOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/login">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
