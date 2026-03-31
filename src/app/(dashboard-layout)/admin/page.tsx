"use client";

import { UserRegisterModal } from "@/components/shared/UserRegisterModal";

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <UserRegisterModal 
            defaultRole="TEACHER" 
            allowRoleChange={false} 
            buttonLabel="Add Teacher" 
          />
          <UserRegisterModal 
            defaultRole="ADMIN" 
            allowRoleChange={false} 
            buttonLabel="Add Admin" 
          />
          <UserRegisterModal 
            defaultRole="PARENT" 
            allowRoleChange={false} 
            buttonLabel="Add Parent" 
          />
        </div>
      </div>
      <p>Welcome to the admin management area.</p>
    </div>
  );
}
