"use server";

import { resetPassword } from "@/services/auth.service";
import { IResetPasswordPayload, resetPasswordSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (payload: IResetPasswordPayload) => {
    const parsedPayload = resetPasswordSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    let redirectTo: string | null = null;

    try {
        const result = await resetPassword(parsedPayload.data);

        if (result.success) {
            redirectTo = "/login";
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
