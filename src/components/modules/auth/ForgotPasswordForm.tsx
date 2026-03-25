"use client";

import { forgotPasswordAction } from "@/app/(common-layout)/forgot-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordSchema, IForgotPasswordPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

const ForgotPasswordForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IForgotPasswordPayload) => forgotPasswordAction(payload),
    });

    const form = useForm({
        defaultValues: {
            email: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value);

                if (result && !result.success) {
                    setServerError(result.message || "Failed to send reset link");
                }
            } catch (error: any) {
                if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
                    // Next.js redirect is handled by the framework
                    return;
                }
                setServerError(error.message || "An unexpected error occurred");
            }
        },
    });

    return (
        <Card className="mx-auto w-full max-w-md shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                <CardDescription>
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field
                        name="email"
                        validators={{ onChange: forgotPasswordSchema.shape.email }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe
                        selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Sending Link..."
                                disabled={!canSubmit}
                            >
                                Send Reset Link
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>

                    <div className="mt-4 text-center text-sm">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Log In
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ForgotPasswordForm;
