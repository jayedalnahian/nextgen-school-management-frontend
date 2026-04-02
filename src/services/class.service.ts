"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IClass, IClassQueryParams } from "@/types/class.types";

function buildQueryString(params: IClassQueryParams): string {
  const query = new URLSearchParams();

  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.section) query.set("section", params.section);
  if (params.isDeleted !== undefined) query.set("isDeleted", params.isDeleted);

  return query.toString();
}

export const getClasses = async (params?: IClassQueryParams | string) => {
  try {
    let queryString: string;
    
    if (typeof params === 'string') {
      queryString = params;
    } else {
      queryString = params ? buildQueryString(params) : "";
    }
    
    const url = queryString ? `/classes?${queryString}` : "/classes";

    const response = await httpClient.get(url);
    
    // Return the full response object with data and meta
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
    console.error("Error fetching classes:", error);
    throw error;
  }
};

export const createClass = async (payload: {
  name: string;
  section?: string;
  monthlyFee?: number;
  capacity?: number;
}) => {
  try {
    const result = await httpClient.post("/classes", payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to create class",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Class created successfully",
    };
  } catch (error: any) {
    console.error("Create class error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const updateClass = async (
  id: string,
  payload: {
    name?: string;
    section?: string;
    monthlyFee?: number;
    capacity?: number;
  }
) => {
  try {
    const result = await httpClient.patch(`/classes/${id}`, payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update class",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Class updated successfully",
    };
  } catch (error: any) {
    console.error("Update class error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const deleteClass = async (id: string) => {
  try {
    const result = await httpClient.delete(`/classes/${id}`);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete class",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Class deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete class error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};
