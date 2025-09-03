import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import axiosInstance from "../../instance/axiosInstance";
import Swal from "sweetalert2";
import TableFlight from "./TableFlight2";
import { FlightType } from "../../types/general_type";
import { Modal } from "../../components/ui/modal";
import FlightDetail from "./FlightDetail";

const Flight = () => {
  // State
  const [files, setFiles] = useState<FileList | null>(null);
  const [flights, setFlights] = useState<FlightType[] | null>(null);
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [flight, setFlight] = useState<FlightType | null>(null);
  const [selectIds, setSelectIds] = useState<string[] | number[] | null>(null);

  const navigate = useNavigate();

  // Constant
  // Display header
  const headers = [
    "",
    "STT",
    "Hãng vận chuyển",
    "Số chuyến bay",
    "Ngày bay",
    "Nơi đi",
    "Nơi đến",
    "Tính năng",
  ];
  // Display attribute
  const attributes = [
    "checkbox",
    "stt",
    "brand",
    "flight_number",
    "flight_date",
    "departure_point",
    "destination_point",
    "features",
  ];

  // Features
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

  const handleDetail = async (id: string) => {
    if (id) {
      try {
        const response = await axiosInstance.get(`/flight/${id}/`);
        if (response.status == 200) {
          setIsDetail(true);
          setFlight(response.data);
        }
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Thông báo",
          text: "Không thể xem chi tiết thông tin chuyến bay",
        });
        console.error(err);
        throw err;
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Không thể xem chi tiết thông tin chuyến bay",
      });
      return;
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
      {/* Feature */}
      <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="grid grid-cols-3">
          <div>
            <button className="rounded-2xl border p-5 bg-blue-light-800 text-white shadow-2xs">
              Lọc
            </button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <TableFlight
          headers={headers}
          flights={flights}
          attrs={attributes}
          handleDetail={handleDetail}
        />
      </div>
      <Modal
        isOpen={isDetail}
        onClose={() => {
          setIsDetail(false);
        }}
        className="max-w-[100vw] m-4"
      >
        {flight ? (
          <div className="relative w-full max-h-[850px] p-4 overflow-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
            <FlightDetail flight={flight} />
          </div>
        ) : (
          <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11 text-red-500 text-2xl font-bold uppercase text-center">
            Không thể tải dữ liệu !!!
          </div>
        )}
      </Modal>
    </>
  );
};

export default Flight;
