"use client"

import AppointmentBarChart from "@/components/shared/AppointmentBarChart"
import AppointmentPieChart from "@/components/shared/AppointmentPieChart"
import StatsCard from "@/components/shared/StatsCard"
import { getDashboardData } from "@/services/dashboard.service"

import { ApiResponse } from "@/types/api.types"
import { IAdminDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"

const AdminDashboardContent = () => {
  const { data: adminDashboardData, isLoading } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  const data = (adminDashboardData as ApiResponse<IAdminDashboardData>)?.data;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your school.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard
          title="Total Students"
          value={data?.studentCount || 0}
          iconName="GraduationCap"
          description="Enrolled students"
          gradient="from-indigo-500 to-violet-500"
        />
        <StatsCard
          title="Total Teachers"
          value={data?.teacherCount || 0}
          iconName="Users"
          description="Active teachers"
          gradient="from-emerald-500 to-teal-500"
        />
        <StatsCard
          title="Total Admins"
          value={data?.adminCount || 0}
          iconName="Shield"
          description="System administrators"
          gradient="from-amber-500 to-orange-500"
        />
        <StatsCard
          title="Total Revenue"
          value={data?.totalRevenue ? `$${data.totalRevenue.toLocaleString()}` : "$0"}
          iconName="DollarSign"
          description="All-time revenue"
          gradient="from-rose-500 to-pink-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
        <div className="lg:col-span-4">
          <AppointmentBarChart data={data?.barChartData || []} />
        </div>
        <div className="lg:col-span-3">
          <AppointmentPieChart data={data?.pieChartData || []} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardContent