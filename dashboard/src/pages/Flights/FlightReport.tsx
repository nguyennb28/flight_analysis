import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";

const FlightReport = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
    }
  }, []);

  return (
    <>
      <PageMeta title="Thống kê" description="Thống kê" />
      <PageBreadcrumb pageTitle="Thống kê" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Thống kê
        </h3>
      </div>
    </>
  );
};

export default FlightReport;
