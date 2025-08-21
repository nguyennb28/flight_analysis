import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import axiosInstance from "../../instance/axiosInstance";
import ComponentCard from "../../components/common/ComponentCard";
import TableGeneric from "./TablePassenger";

const FlightReport = () => {
  // State
  const [reports, setReports] = useState<any[] | null>(null);
  const [records, setRecords] = useState<any[] | null>(null);

  const navigate = useNavigate();

  const getReport = async () => {
    try {
      const response = await axiosInstance.get("/upload-excel/");
      if (response.status == 200) {
        // setReports(response.data.second_data);
        setReports(response.data.report);
        setRecords(response.data.data);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const headers = [
    // "Số lần đi",
    "Tên",
    "Quốc tịch",
    "Ngày sinh",
    "Điểm đi",
    "Điểm đến",
    "Số giấy tờ",
    "Ngày bay",
  ];

  const attributes = [
    "stt",
    "name",
    "nationality",
    "date_of_birth",
    "departure_point",
    "destination_point",
    "number_of_document",
    "flight__flight_date"
  ];

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
    }

    getReport();
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
      <div className="space-y-6 mt-4">
        <ComponentCard title="Bảng chi tiết">
          {records && (
            <TableGeneric
              headers={headers}
              records={records}
              attributes={attributes}
            />
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default FlightReport;
