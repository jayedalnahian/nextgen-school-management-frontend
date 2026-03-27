import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import VerifyEmailForm from "@/components/modules/auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Check your email for verification link",
};

const EmailVerifyPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <VerifyEmailForm />
    </div>
  );
};

export default EmailVerifyPage;
