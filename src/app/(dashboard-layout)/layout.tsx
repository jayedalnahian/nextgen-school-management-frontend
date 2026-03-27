import DashboardNavbar from "@/components/modules/Dashboord/DashboardNavbar"
import DashboardSidebar from "@/components/modules/Dashboord/DashboardSidebar"
import { getUserInfo } from "@/services/auth.service"
import { redirect } from "next/navigation"
import React from "react"

const RootDashboardLayout = async ({children} : {children: React.ReactNode}) => {

  
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
        {/* Dashboard Sidebar */}
        <DashboardSidebar userInfo={userInfo} />

        <div className="flex flex-1 flex-col overflow-hidden">
            {/* DashboardNavbar */}
            <DashboardNavbar userInfo={userInfo} />
            {/* Dashboard Content */}
            <main className="flex-1 overflow-y-auto bg-linear-to-br from-background via-background to-accent/30 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    </div>
  )
}

export default RootDashboardLayout