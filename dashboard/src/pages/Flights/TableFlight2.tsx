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
  return (
    // <ComponentCard title="">
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
                          <input type="checkbox" value={flight.id} />
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
    // </ComponentCard>
  );
};

export default TableFlight;
