import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-wrapper">
      {/* Global Dashboard Navbar/Sidebar could go here */}
      {children}
    </div>
  );
}
