"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.types"
import { User as UserType } from "@/types/user.types";
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"


interface DashboardSidebarContentProps {
    userInfo : UserType,
    navItems : NavSection[],
    dashboardHome : string,
}


const DashboardSidebarContent = ({dashboardHome, navItems, userInfo} : DashboardSidebarContentProps) => {
    const pathname = usePathname()
  return (
    <div className="hidden md:flex h-full w-64 flex-col overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <Link href={dashboardHome} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            NextGen School
          </span>
        </Link>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-3 py-5">
        <nav className="space-y-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-3 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200",
                      )}
                    >
                      <Icon className={cn(
                        "w-[18px] h-[18px] transition-transform duration-200",
                        !isActive && "group-hover:scale-110"
                      )} />
                      <span className="flex-1">{item.title}</span>
                      {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <div className="my-4 mx-3 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom */}
      <div className="border-t border-white/10 px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.06] transition-colors duration-200 cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center ring-2 ring-indigo-400/20 shadow-lg shadow-indigo-500/20">
            <span className="text-sm font-bold text-white">
              {userInfo.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">{userInfo.name}</p>
            <p className="text-xs text-slate-500 capitalize">
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebarContent