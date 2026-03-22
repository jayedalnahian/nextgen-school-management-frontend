import React from "react";

export default function CommonProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="protected-layout">
      {/* Sidebar/Navbar Logic for Admin/Teacher/Parent */}
      <nav className="p-4 border-b">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
