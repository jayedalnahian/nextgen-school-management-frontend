import ResetPasswordForm from "@/components/modules/auth/ResetPasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Enter OTP to reset your password",
};

const ResetPasswordPage = () => {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
};

export default ResetPasswordPage;
