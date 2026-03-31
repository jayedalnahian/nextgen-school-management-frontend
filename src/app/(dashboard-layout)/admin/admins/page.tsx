import AdminsTable from "@/components/modules/Dashboord/Admin/AdminsManagement/AdminsTable";
import { UserRegisterModal } from "@/components/shared/UserRegisterModal";
import { getAdmins } from "@/services/admin.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const AdminAdminsPage = async ({
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
    queryKey: ["admins", queryString],
    queryFn: () => getAdmins(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admins</h1>
        <UserRegisterModal defaultRole="ADMIN" allowRoleChange={false} buttonLabel="Add Admin" />
      </div>
      <AdminsTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default AdminAdminsPage;
