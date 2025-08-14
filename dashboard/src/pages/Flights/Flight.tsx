import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import axiosInstance from "../../instance/axiosInstance";
import Swal from "sweetalert2";
import TableFlight from "./TableFlight";
import { FlightType } from "../../types/general_type";

const Flight = () => {
  // State
  const [files, setFiles] = useState<FileList | null>(null);
  const [flights, setFlights] = useState<FlightType[] | null>(null);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      try {
        const response = await axiosInstance.post("/upload-excel/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status == 201) {
          Swal.fire({
            icon: "success",
            title: "Thông tin",
            text: "File đã được gửi thành công",
          }).then((result) => {
            if (result.isConfirmed) window.location.reload();
          });
        }
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Thông tin",
          text: "Không thể gửi file tới server",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Thông tin",
        text: "Chưa chọn file",
      });
      return;
    }
  };

  const fetch_flights = async () => {
    try {
      const response = await axiosInstance.get("/flight/");
      if (response.status == 200) {
        setFlights(response.data.results);
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Không thể lấy dữ liệu chuyến bay từ cơ sở dữ liệu",
      });
      throw err;
    }
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
      return;
    }
    fetch_flights();
  }, []);

  return (
    <>
      <PageMeta title="Flight" description="Flight" />
      <PageBreadcrumb pageTitle="Flight" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Chuyến bay
        </h3>
        <div className="space-y-6">
          <div>
            <input
              type="file"
              accept=".xlsx,.xls"
              multiple
              className="form-input"
              onChange={handleFileChange}
            />
            <button
              className="border-2 p-3 mt-3 rounded-2xl bg-emerald-700 text-white"
              onClick={handleUpload}
            >
              Tải file excel
            </button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {flights && <TableFlight flights={flights} />}
      </div>
    </>
  );
};

export default Flight;
