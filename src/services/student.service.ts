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

export const registerStudent = async (payload: {
  name: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  classId: string;
  parentId: string;
}) => {
  try {
    const result = await httpClient.post("/students", payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to register student",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Student registered successfully",
    };
  } catch (error: any) {
    console.error("Register student error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const updateStudent = async (
  id: string,
  payload: {
    name?: string;
    dob?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    classId?: string;
    roll?: number;
  }
) => {
  try {
    const result = await httpClient.patch(`/students/${id}`, payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update student",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Student updated successfully",
    };
  } catch (error: any) {
    console.error("Update student error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};
