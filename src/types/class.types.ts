export interface IClass {
  id: string;
  name: string;
  section: string | null;
  monthlyFee: number;
  capacity: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  _count?: {
    students: number;
    teachers: number;
    subjects: number;
  };
}

export interface IClassQueryParams {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  section?: string;
  isDeleted?: string;
  include?: string;
}
