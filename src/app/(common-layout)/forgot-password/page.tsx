import ForgotPasswordForm from "@/components/modules/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your account password",
};

const ForgotPasswordPage = () => {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
            <ForgotPasswordForm />
        </div>
    );
};

export default ForgotPasswordPage;
