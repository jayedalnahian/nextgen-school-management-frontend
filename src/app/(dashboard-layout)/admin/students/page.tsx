import StudentsTable from "@/components/modules/Dashboord/Admin/StudentsManagement/StudentsTable";
import { getStudents } from "@/services/student.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const AdminStudentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;
  // Automatically handles escaping and joining
  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (value === undefined) {
        return "";
      }

      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["students", queryString],
    queryFn: () => getStudents(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudentsTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default AdminStudentsPage;
