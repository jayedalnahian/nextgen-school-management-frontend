import ParentsTable from "@/components/modules/Dashboord/Admin/ParentsManagement/ParentsTable";
import { getParents } from "@/services/parent.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const AdminParentsPage = async ({
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
    queryKey: ["parents", queryString],
    queryFn: () => getParents(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ParentsTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default AdminParentsPage;
