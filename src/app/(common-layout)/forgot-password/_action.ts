"use server";

import { forgotPassword, resendVerificationEmail } from "@/services/auth.service";
import { forgotPasswordSchema, IForgotPasswordPayload } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const forgotPasswordAction = async (payload: IForgotPasswordPayload) => {
    const parsedPayload = forgotPasswordSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    let redirectTo: string | null = null;

    try {
        const result = await forgotPassword(parsedPayload.data);

        if (result.success) {
            redirectTo = `/reset-password?email=${parsedPayload.data.email}`;
        } else {
            return result;
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to process request",
        };
    }

    if (redirectTo) {
        redirect(redirectTo);
    }
};

export const resendVerificationEmailAction = async (payload: IForgotPasswordPayload) => {
    const parsedPayload = forgotPasswordSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        const result = await resendVerificationEmail(parsedPayload.data);
        return result;
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to process request",
        };
    }
};
