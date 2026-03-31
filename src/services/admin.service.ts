"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdmin } from "@/types/admin.types";

export const getAdmins = async (queryString: string) => {
    try {
        const admins = await httpClient.get<IAdmin[]>(queryString ? `/users?role=ADMIN&${queryString}&include=admin` : "/users?role=ADMIN&include=admin");
        return admins;
    } catch (error) {
        console.log("Error fetching admins:", error);
        throw error;
    }
}