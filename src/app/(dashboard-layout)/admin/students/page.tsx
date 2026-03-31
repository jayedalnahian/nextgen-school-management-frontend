import StudentsTable from "@/components/modules/Dashboord/Admin/StudentsManagement/StudentsTable";
import { StudentRegisterModal } from "@/components/shared/StudentRegisterModal";
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <StudentRegisterModal buttonLabel="Add Student" />
      </div>
      <StudentsTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default AdminStudentsPage;
