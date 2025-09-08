import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useLoading } from "../context/LoadingContext";
import Swal from "sweetalert2";
import { User } from "../types/general_type";
import axiosInstance from "../instance/axiosInstance";
import { useNavigate } from "react-router";

export default function UserProfiles() {
  // Context
  const { user, logout } = useAuth();
  const { loading, showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  // Feature
  const onSubmit = async (data: User) => {
    if (!data) {
      Swal.fire({
        icon: "error",
        title: "Dữ liệu rỗng",
        text: "Cung cấp dữ liệu",
      });
      return;
    }
    try {
      if (data.password?.length == 0 || !data.password) {
        delete data.password;
      }
      const response = await axiosInstance.patch(`/users/${data.id}/`, {
        ...data,
      });
      if (response.status == 200) {
        Swal.fire({
          icon: "success",
          title: "Cập nhật",
          text: "Cập nhật thành công",
          timer: 1000,
        });
        window.location.reload();
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi trong quá trình cập nhật thông tin người dùng",
        text: "Có lỗi trong việc cập nhật thông tin người dùng",
      });
    }
  };

  useEffect(() => {
    if (!user) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [user]);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
    } else if (access == "undefined") {
      navigate("/signin", { replace: true });
      logout();
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Không thể truy cập!",
      });
    }
  }, []);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <PageMeta title="Profile" description="Profile" />
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
                username={user.username}
                first_name={user.first_name}
                last_name={user.last_name}
                full_name={user.full_name}
                role={user.role}
                phone={user.phone}
              />
              <UserInfoCard
                id={user.id}
                username={user.username}
                first_name={user.first_name}
                last_name={user.last_name}
                role={user.role}
                phone={user.phone}
                onSubmit={onSubmit}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
