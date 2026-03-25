"use client";

import { resetPasswordAction } from "@/app/(common-layout)/reset-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IResetPasswordPayload, resetPasswordSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ResetPasswordForm = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setshowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IResetPasswordPayload) => resetPasswordAction(payload),
    });

    const form = useForm({
        defaultValues: {
            email: email,
            otp: "",
            newPassword: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value);

                if (result && !result.success) {
                    setServerError(result.message || "Failed to reset password");
                }
            } catch (error: any) {
                if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
                    return;
                }
                setServerError(error.message || "An unexpected error occurred");
            }
        },
    });

    return (
        <Card className="mx-auto w-full max-w-md shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                    Enter the OTP sent to your email and your new password.
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
                        validators={{ onChange: resetPasswordSchema.shape.email }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                disabled={Boolean(email)}
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="otp"
                        validators={{ onChange: resetPasswordSchema.shape.otp }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="OTP"
                                type="text"
                                placeholder="Enter 6-digit OTP"
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="newPassword"
                        validators={{ onChange: resetPasswordSchema.shape.newPassword }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                append={
                                    <Button
                                        type="button"
                                        onClick={() => setshowPassword((p) => !p)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                }
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
                                pendingLabel="Resetting Password..."
                                disabled={!canSubmit}
                            >
                                Reset Password
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>
        </Card>
    );
};

export default ResetPasswordForm;
