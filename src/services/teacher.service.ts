"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ITeacher } from "@/types/teacher.types";

export const getTeachers = async (queryString: string) => {
    try {
        const teachers = await httpClient.get<ITeacher[]>(queryString ? `/users?role=TEACHER&${queryString}&include=teacher` : "/users?role=TEACHER&include=teacher");
        return teachers;
    } catch (error) {
        console.log("Error fetching teachers:", error);
        throw error;
    }
}