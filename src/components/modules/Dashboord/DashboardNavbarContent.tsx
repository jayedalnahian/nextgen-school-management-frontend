"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.types";

import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { User } from "@/types/user.types";

interface DashboardNavbarProps {
    userInfo : User;
    navItems: NavSection[];
    dashboardHome : string
}

const DashboardNavbarContent = ({dashboardHome, navItems, userInfo} : DashboardNavbarProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkSmallerScreen = () => {
            setIsMobile(window.innerWidth < 768);
        }

        checkSmallerScreen();
        window.addEventListener("resize", checkSmallerScreen);

        return () => {
            window.removeEventListener("resize", checkSmallerScreen);
        };
    }, []);

  return (
    <div className="flex items-center gap-4 w-full px-4 py-3 border-b border-border/60 bg-background/80 glass-effect sticky top-0 z-30">
      {/* Mobile Menu Toggle Button And Menu */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
              <Button variant={"outline"} size={"icon"} className="rounded-xl border-border/60 hover:bg-accent/80 transition-all duration-200">
                  <Menu className="h-5 w-5"/>
              </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0 border-0">
              <DashboardMobileSidebar userInfo={userInfo} dashboardHome={dashboardHome} navItems={navItems} />
          </SheetContent>
      </Sheet>


      {/* Search Component */}
      <div className="flex-1 flex items-center">
          <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 h-10 rounded-xl border-border/60 bg-muted/40 focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
              />
          </div>
      </div>


      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
          {/* Notification */}
          <NotificationDropdown/>

          {/* User Dropdown  */}
          <UserDropdown userInfo={userInfo}/>
      </div>
    </div>
  )
}

export default DashboardNavbarContent