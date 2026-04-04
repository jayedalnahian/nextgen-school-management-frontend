export interface IResult {
  id: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    studentID: string;
    class?: {
      id: string;
      name: string;
      section: string | null;
    };
  };
  examId: string;
  exam?: {
    id: string;
    name: string;
    examType: string;
    totalMarks: number;
  };
  subjectId: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  marksObtained: number;
  grade: string | null;
  remarks: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IResultQueryParams {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  studentId?: string;
  examId?: string;
  subjectId?: string;
  classId?: string;
  isDeleted?: string;
  include?: string;
}

export interface ICreateResultPayload {
  studentId: string;
  examId: string;
  subjectId: string;
  marksObtained: number;
  grade?: string;
  remarks?: string;
}

export interface IUpdateResultPayload {
  marksObtained?: number;
  grade?: string;
  remarks?: string;
}
