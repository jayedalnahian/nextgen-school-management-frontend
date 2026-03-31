"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IClass } from "@/types/student.types";

export const getClasses = async () => {
  try {
    const response = await httpClient.get<IClass[]>("/classes");
    return response;
  } catch (error) {
    console.log("Error fetching classes:", error);
    throw error;
  }
};
