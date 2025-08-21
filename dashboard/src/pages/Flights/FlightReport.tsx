import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import axiosInstance from "../../instance/axiosInstance";
import ComponentCard from "../../components/common/ComponentCard";
import TablePassenger from "./TablePassenger";
import TableReport from "./TableReport";

const FlightReport = () => {
  // State
  const [reports, setReports] = useState<any[] | null>(null);
  const [records, setRecords] = useState<any[] | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const navigate = useNavigate();

  // Constant
  const passenger_headers = [
    "STT",
    "Tên",
    "Quốc tịch",
    "Ngày sinh",
    "Điểm đi",
    "Điểm đến",
    "Số giấy tờ",
    "Ngày bay",
  ];
  const passenger_attributes = [
    "stt",
    "name",
    "nationality",
    "date_of_birth",
    "departure_point",
    "destination_point",
    "number_of_document",
    "flight__flight_date",
  ];

  const report_headers = ["Số lần bay", "Tên", "Số giấy tờ"];
  const report_attributes = ["travel_times", "name", "number_of_document"];

  // Features
  const getReport = async () => {
    if (!startDate && !endDate) {
      try {
        const response = await axiosInstance.get(`/report-flight-general/`);
        if (response.status == 200) {
          setReports(response.data.report);
          setRecords(response.data.data);
        }
      } catch (err: any) {
        console.error(err);
      }
    }
    if (startDate && endDate) {
      try {
        const response = await axiosInstance.get(
          `/report-flight-date/?startDate=${startDate}&endDate=${endDate}`
        );
        if (response.status == 200) {
          setReports(response.data.report);
          setRecords(response.data.data);
        }
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  const handleDate = (flag: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (flag == "start") {
      setStartDate(e.currentTarget.value);
    } else {
      setEndDate(e.currentTarget.value);
    }
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
    }
  }, []);

  useEffect(() => {
    getReport();
  }, [startDate, endDate]);

  return (
    <>
      <PageMeta title="Thống kê" description="Thống kê" />
      <PageBreadcrumb pageTitle="Thống kê" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Thống kê
        </h3>
        <div className="features flex justify-items-between">
          <div className="flex flex-col">
            <label className="text-lg">Ngày bắt đầu</label>
            <input
              type="date"
              className="border-2 p-3 rounded-xl border-gray-500"
              onChange={(e) => handleDate("start", e)}
            />
          </div>
          <div className="flex flex-col ml-4">
            <label className="text-lg">Ngày kết thúc</label>
            <input
              type="date"
              className="border-2 p-3 rounded-xl border-gray-500"
              onChange={(e) => handleDate("end", e)}
            />
          </div>
        </div>
      </div>
      {/* Table Report */}
      {reports && (
        <div className="space-y-6 mt-4">
          <ComponentCard title="Bảng báo cáo chung">
            <TableReport
              headers={report_headers}
              records={reports}
              attributes={report_attributes}
            />
          </ComponentCard>
        </div>
      )}
      {/* Table Passenger */}
      {records && (
        <div className="space-y-6 mt-4">
          <ComponentCard title="Bảng chi tiết chung">
            {records && (
              <TablePassenger
                headers={passenger_headers}
                records={records}
                attributes={passenger_attributes}
              />
            )}
          </ComponentCard>
        </div>
      )}
      {!reports && !records && (
        <div className="text-2xl text-red-400 text-center">
          Không có dữ liệu
        </div>
      )}
    </>
  );
};

export default FlightReport;
