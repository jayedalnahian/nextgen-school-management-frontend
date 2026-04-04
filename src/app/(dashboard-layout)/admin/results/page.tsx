import ResultsTable from "@/components/modules/Dashboord/Admin/ResultsManagement/ResultsTable";
import { getResults } from "@/services/result.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const ResultsManagement = async ({
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
    queryKey: ["results", queryString],
    queryFn: () => getResults(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Results Management</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Add Result
        </button>
      </div>
      <ResultsTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default ResultsManagement;
