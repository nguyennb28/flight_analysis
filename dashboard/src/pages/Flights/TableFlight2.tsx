import { useState, MouseEvent } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { FlightType } from "../../types/general_type";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Modal } from "../../components/ui/modal";
import Swal from "sweetalert2";
import axiosInstance from "../../instance/axiosInstance";
import TableReport from "./TableReport";

interface Props {
  headers: any[] | null;
  flights: any[] | FlightType[] | null;
  attrs: any[] | null;
  handleDetail: (id: any) => void;
}

const TableFlight = ({ headers, flights, attrs, handleDetail }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReport, setIsReport] = useState<boolean>(false);
  const [reports, setReports] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  const report_headers = ["Số lần bay", "Tên", "Số giấy tờ"];
  const report_attributes = ["travel_times", "name", "number_of_document"];

  const handleSelect = (e: MouseEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    const selectedValue = e.currentTarget.value;
    if (isChecked) {
      setSelectedIds((prev) => [...prev, selectedValue]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== selectedValue));
    }
  };

  const handleReport = async (flight_ids: string[] | null) => {
    if (!flight_ids) {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Hãy lựa chọn chuyến bay",
      });
      return;
    }
    try {
      const response = await axiosInstance.post(`/report-flight-date/`, {
        flight_ids,
      });
      if (response.status == 200) {
        const { record, report } = response.data.data;
        setRecords(record);
        setReports(report);
      }
    } catch (err: any) {
      console.error(err);
      setIsReport(false);
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Có lỗi trong việc lấy thông tin",
      });
    }
  };

  const openModalReport = (flight_ids: string[]) => {
    if (flight_ids.length < 1) {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Hãy lựa chọn chuyến bay",
      });
      return;
    }
    setIsReport(true);
    handleReport(flight_ids);
  };

  return (
    <>
      {/* Feature */}
      <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="grid grid-cols-3">
          <div>
            <button
              className="rounded-2xl border p-5 bg-blue-light-800 text-white shadow-2xs"
              onClick={() => {
                openModalReport(selectedIds);
              }}
            >
              Lọc
            </button>
          </div>
        </div>
      </div>
      <Table className="overflow-scroll">
        {headers && (
          <>
            <TableHeader className="border-b gray-100 dark:border-white/[0.05]">
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 text-gray-700
                        text-start text-lg dark:text-gray-400 uppercase
                    "
                  >
                    {header == "" && (
                      <input type="checkbox" className="select-all" />
                    )}
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y text-2xl font-normal divide-gray-100 dark:divide-white/[0.05] max-h-80 overflow-auto">
              {flights &&
                flights.map((flight, index) => (
                  <TableRow key={index} className="hover:shadow-2xl">
                    {/* <p className="dark:text-white justify-self-center">{index}</p> */}
                    {attrs &&
                      attrs.map((attr, i) => (
                        <TableCell key={i} className="sm:px-6 text-start">
                          {/* <p className="dark:text-white">{attr != "stt" || attr != "features" ? }</p> */}
                          {attr == "checkbox" && (
                            <input
                              type="checkbox"
                              value={flight.id}
                              onClick={(e) => handleSelect(e)}
                            />
                          )}
                          {attr == "stt" && (
                            <p className="dark:text-white">{index}</p>
                          )}
                          {attr != "stt" && attr != "features" && (
                            <p className="dark:text-white">{flight[attr]}</p>
                          )}
                          {attr == "features" && (
                            <button
                              type="button"
                              value={flight.id}
                              onClick={(e) => {
                                handleDetail(e.currentTarget.value);
                              }}
                            >
                              <MdRemoveRedEye
                                size={35}
                                className="text-emerald-600"
                              />
                            </button>
                          )}
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
            </TableBody>
          </>
        )}
      </Table>
      <Modal
        isOpen={isReport}
        onClose={() => setIsReport(false)}
        className="max-w-[100vw] m-4"
      >
        <div className="relative w-full max-h-[90vh] p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          {!records && (
            <h3 className="text-red-500 text-2xl uppercase font-semibold">
              Không lấy được dữ liệu
            </h3>
          )}
          {reports.length > 0 && (
            <TableReport
              headers={report_headers}
              attributes={report_attributes}
              records={reports}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default TableFlight;
