"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IStudent } from "@/types/student.types";

export const getStudents = async (queryString: string) => {
  try {
    const students = await httpClient.get<IStudent[]>(
      queryString 
        ? `/students?${queryString}` 
        : "/students"
    );
    return students;
  } catch (error) {
    console.log("Error fetching students:", error);
    throw error;
  }
};
