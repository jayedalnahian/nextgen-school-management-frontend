"use client";

import React, { useState } from "react";
import { loginSchema } from "@/zod/auth.validation";
import {
  FormBuilder,
  type FormFieldConfig,
} from "@/components/shared/form/FormBuilder";
import { loginUser } from "@/services/auth.service";
import { z } from "zod";
import { getDefaultDashboardRoute } from "@/lib/authUtils";

type LoginFormValues = z.infer<typeof loginSchema>;

const loginFields: FormFieldConfig<LoginFormValues>[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "your@email.com",
    className: "sm:col-span-2",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    className: "sm:col-span-2",
  },
];

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const result = await loginUser(data);

      if (result.success) {
        // Get correct dashboard route based on role
        const role = result.data.user.role;
        const dashboardRoute = getDefaultDashboardRoute(role);
        
        // Use window.location for a full refresh to ensure middleware picks up new cookies
        window.location.href = dashboardRoute;
      } else {
        alert(result.message || "An error occurred during login");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <FormBuilder<LoginFormValues>
        schema={loginSchema as any}
        fields={loginFields}
        onSubmit={onSubmit}
        isLoading={loading}
        submitText="Login"
        className="grid-cols-1" // Stack fields on mobile
      />
    </div>
  );
}
