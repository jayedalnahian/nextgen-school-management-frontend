"use client";

import {
  resendOTPAction,
  verifyEmailAction,
} from "@/app/(common-layout)/verify-email/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Key, Loader2, MailCheck, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const verifyEmailZodSchema = z.object({
    otp: z.string().min(6, "Code must be at least 6 characters long"),
    email: z.email("Invalid email address"),
  });

  const { mutateAsync: verifyEmail, isPending: isVerifying } = useMutation({
    mutationFn: (payload: { otp: string; email: string }) =>
      verifyEmailAction(payload),
  });

  const { mutateAsync: resendOTP, isPending: isResending } = useMutation({
    mutationFn: (payload: { email: string }) => resendOTPAction(payload),
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success("Verification code resent successfully");
        setResendCountdown(60);
      } else {
        toast.error(data?.message || "Failed to resend code");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });

  const handleResend = async () => {
    if (resendCountdown > 0 || isResending) return;
    await resendOTP({ email });
  };

  const form = useForm({
    defaultValues: {
      otp: "",
      email: email,
    },
    validators: {
      onChange: verifyEmailZodSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await verifyEmail(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Verification failed");
          return;
        }
      } catch (error: any) {
         console.error(`Verification failed: ${error.message}`);

        if (
          error &&
          typeof error === "object" &&
          "digest" in error &&
          typeof error.digest === "string" &&
          error.digest.startsWith("NEXT_REDIRECT")
        ) {
          const redirectParts = error.digest.split(";");
          const targetPath = redirectParts[2];
          if (targetPath) {
            window.location.href = targetPath;
          }
          return;
        }

        setServerError(`Verification failed: ${error.message}`);
      }
    },
  });
  return (
    <Card className="mx-auto w-full max-w-md shadow-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification code to your email address. Please
          check your inbox and enter the code below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: verifyEmailZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                disabled={true}
                placeholder={email}
              />
            )}
          </form.Field>

          <form.Field
            name="otp"
            validators={{ onChange: verifyEmailZodSchema.shape.otp }}
          >
            {(field) => (
              <div className="space-y-1">
                <AppField
                  field={field}
                  label="Verification Code"
                  type="text"
                  placeholder="000000"
                  className="cursor-pointer"
                />
                <div className="flex justify-end px-1">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCountdown > 0 || isResending}
                    className="text-xs font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline flex items-center gap-1 transition-colors"
                  >
                    {isResending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-3 w-3" />
                    )}
                    {resendCountdown > 0
                      ? `Resend in ${resendCountdown}s`
                      : "Resend Code"}
                  </button>
                </div>
              </div>
            )}
          </form.Field>

          {serverError && (
            <Alert variant={"destructive"}>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isVerifying}
                pendingLabel="Verifying OTP..."
                disabled={!canSubmit}
              >
                Verify OTP
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50 text-center space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email?
            </p>
            <p className="text-xs text-muted-foreground/70">
              Check your spam folder or try resending the code above.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              Use another email
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyEmailForm;
