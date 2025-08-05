import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useLoading } from "../context/LoadingContext";

export default function UserProfiles() {
  // Context
  const { user } = useAuth();
  const { loading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (!user) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [user]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {user && (
            <>
              <UserMetaCard
                id={user.id}
                first_name={user.first_name}
                last_name={user.last_name}
                full_name={user.full_name}
                role={user.role}
                phone={user.phone}
              />
              <UserInfoCard
                id={user.id}
                first_name={user.first_name}
                last_name={user.last_name}
                full_name={user.full_name}
                role={user.role}
                phone={user.phone}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
