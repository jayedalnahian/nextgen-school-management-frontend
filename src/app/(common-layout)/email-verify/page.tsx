import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verify Email",
    description: "Check your email for verification link",
};

const EmailVerifyPage = () => {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
            <Card className="mx-auto w-full max-w-md shadow-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <MailCheck className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Didn&apos;t receive the email? Check your spam folder or try again.
                    </p>
                    <div className="flex flex-col space-y-2">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                            Try another email
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                            Return to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailVerifyPage;
