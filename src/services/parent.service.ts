"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IParent } from "@/types/parent.types";

export const getParents = async (queryString: string) => {
  try {
    const parents = await httpClient.get<IParent[]>(
      queryString 
        ? `/users?role=PARENT&${queryString}&include=parent` 
        : "/users?role=PARENT&include=parent"
    );
    return parents;
  } catch (error) {
    console.log("Error fetching parents:", error);
    throw error;
  }
};
