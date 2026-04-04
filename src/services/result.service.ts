import { httpClient } from "@/lib/axios/httpClient";
import { buildQueryString } from "@/lib/query-utils";
import {
  IResult,
  IResultQueryParams,
  ICreateResultPayload,
  IUpdateResultPayload,
} from "@/types/result.types";

export const getResults = async (params?: IResultQueryParams | string) => {
  try {
    let queryString: string;

    if (typeof params === "string") {
      queryString = params;
    } else {
      queryString = params ? buildQueryString(params) : "";
    }

    const url = queryString ? `/results?${queryString}` : "/results";

    const response = await httpClient.get(url);

    return {
      data: response.data || [],
      meta: response.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

export const getResultById = async (id: string) => {
  try {
    const response = await httpClient.get(`/results/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching result:", error);
    throw error;
  }
};

export const createResult = async (payload: ICreateResultPayload) => {
  try {
    const response = await httpClient.post("/results", payload);
    return {
      success: true,
      data: response.data,
      message: "Result created successfully",
    };
  } catch (error: any) {
    console.error("Error creating result:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Failed to create result",
    };
  }
};

export const updateResult = async (id: string, payload: IUpdateResultPayload) => {
  try {
    const response = await httpClient.patch(`/results/${id}`, payload);
    return {
      success: true,
      data: response.data,
      message: "Result updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating result:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Failed to update result",
    };
  }
};

export const deleteResult = async (id: string) => {
  try {
    const response = await httpClient.delete(`/results/${id}`);
    return {
      success: true,
      data: response.data,
      message: "Result deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting result:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Failed to delete result",
    };
  }
};

// Dummy data for development
export const dummyResults: IResult[] = [
  {
    id: "res-001",
    studentId: "stu-001",
    student: {
      id: "stu-001",
      name: "John Doe",
      studentID: "STU2024001",
      class: {
        id: "cls-001",
        name: "Class 10",
        section: "A",
      },
    },
    examId: "exam-001",
    exam: {
      id: "exam-001",
      name: "Mid-Term Examination 2024",
      examType: "MID_TERM",
      totalMarks: 100,
    },
    subjectId: "sub-001",
    subject: {
      id: "sub-001",
      name: "Mathematics",
      code: "MATH101",
    },
    marksObtained: 85,
    grade: "A",
    remarks: "Excellent performance",
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "res-002",
    studentId: "stu-002",
    student: {
      id: "stu-002",
      name: "Jane Smith",
      studentID: "STU2024002",
      class: {
        id: "cls-001",
        name: "Class 10",
        section: "A",
      },
    },
    examId: "exam-001",
    exam: {
      id: "exam-001",
      name: "Mid-Term Examination 2024",
      examType: "MID_TERM",
      totalMarks: 100,
    },
    subjectId: "sub-002",
    subject: {
      id: "sub-002",
      name: "English",
      code: "ENG101",
    },
    marksObtained: 78,
    grade: "B",
    remarks: "Good effort",
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "res-003",
    studentId: "stu-003",
    student: {
      id: "stu-003",
      name: "Bob Johnson",
      studentID: "STU2024003",
      class: {
        id: "cls-002",
        name: "Class 9",
        section: "B",
      },
    },
    examId: "exam-002",
    exam: {
      id: "exam-002",
      name: "Final Examination 2024",
      examType: "FINAL",
      totalMarks: 100,
    },
    subjectId: "sub-003",
    subject: {
      id: "sub-003",
      name: "Science",
      code: "SCI101",
    },
    marksObtained: 92,
    grade: "A+",
    remarks: "Outstanding",
    isDeleted: false,
    deletedAt: null,
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  },
];
