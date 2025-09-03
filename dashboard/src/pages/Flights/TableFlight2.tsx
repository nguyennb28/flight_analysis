import { useState, MouseEvent, useEffect } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { FlightType } from "../../types/general_type";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface Props {
  headers: any[] | null;
  flights: any[] | FlightType[] | null;
  attrs: any[] | null;
  handleDetail: (id: any) => void;
}

const TableFlight = ({ headers, flights, attrs, handleDetail }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (e: MouseEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    const selectedValue = e.currentTarget.value;
    if (isChecked) {
      setSelectedIds((prev) => [...prev, selectedValue]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== selectedValue));
    }
  };

  useEffect(() => {
    console.log(selectedIds);
  }, [selectedIds]);

  return (
    <>
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
    </>
    // <ComponentCard title="">
    // </ComponentCard>
  );
};

export default TableFlight;
