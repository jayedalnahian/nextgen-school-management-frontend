import React from "react";

export default function CommonProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="protected-layout">
      {/* Sidebar/Navbar Logic for Admin/Teacher/Parent */}
      
      <main className="p-6">{children}</main>
    </div>
  );
}
