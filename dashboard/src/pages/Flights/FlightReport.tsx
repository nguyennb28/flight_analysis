import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import axiosInstance from "../../instance/axiosInstance";
import ComponentCard from "../../components/common/ComponentCard";
import TablePassenger from "./TablePassenger";
import TableReport from "./TableReport";
import Swal from "sweetalert2";
import { IoReload } from "react-icons/io5";

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
          setRecords(response.data.record);
        }
      } catch (err: any) {
        console.error(err);
      }
    }
    if (startDate && endDate) {
      const compare = compareDates(startDate, endDate);
      if (compare) {
        setStartDate("");
        setEndDate("");
        Swal.fire({
          icon: "error",
          title: "Thông báo",
          text: "Ngày kết thúc phải luôn lớn hơn ngày bắt đầu",
        });
        return;
      }
      try {
        const response = await axiosInstance.get(
          `/report-flight-date/?startDate=${startDate}&endDate=${endDate}`
        );
        if (response.status == 200) {
          const report = response.data.report;
          const record = response.data.record;
          if (report == null || report.length == 0) {
            setReports(null);
          } else {
            setReports(report);
          }
          if (record == null || record.length == 0) {
            setRecords(null);
          } else {
            setRecords(record);
          }
        }
      } catch (err: any) {
        console.error(err.response.data.msg);
        setReports(null);
        setRecords(null);
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

  const compareDates = (start: string, end: string) => {
    if (start && end) {
      const date1 = new Date(start);
      const date2 = new Date(end);
      if (date2 < date1) {
        return true;
      }
    }
  };

  const refresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access || access == "undefined") {
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
        <div className="features flex flex-col md:flex-row md:items-end justify-start  md:justify-between">
          <div className="flex flex-col md:flex-row container-1">
            <div className="flex flex-col">
              <label className="text-lg">Ngày bắt đầu</label>
              <input
                type="date"
                className="border-2 p-3 rounded-xl border-gray-500"
                onChange={(e) => handleDate("start", e)}
                value={startDate}
              />
            </div>
            <div className="flex flex-col md:ml-4">
              <label className="text-lg">Ngày kết thúc</label>
              <input
                type="date"
                className="border-2 p-3 rounded-xl border-gray-500"
                onChange={(e) => handleDate("end", e)}
                value={endDate}
              />
            </div>
          </div>
          <div>
            <button
              type="button"
              className="shadow-2xl bg-gray-500 p-5 rounded-3xl"
              title="Reset"
              onClick={refresh}
            >
              <IoReload className="text-white" size={30} />
            </button>
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
