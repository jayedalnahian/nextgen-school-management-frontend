import ClassesTable from "@/components/modules/Dashboord/Admin/ClassesManagement/ClassesTable";
import { getClasses } from "@/services/class.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const AdminClassesPage = async ({
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
    queryKey: ["classes", queryString],
    queryFn: () => getClasses(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Classes</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Add Class
        </button>
      </div>
      <ClassesTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default AdminClassesPage;
