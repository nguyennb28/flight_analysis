import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface Props {
  headers: string[] | null;
  records: any[] | null;
  attributes: string[] | null;
}

// Define the table data using the interface
const TableReport = ({ headers, records, attributes }: Props) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {headers &&
                headers.map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="text-xl px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {records &&
              records.map((record, idx) => (
                <TableRow key={idx}>
                  {attributes &&
                    attributes.map((attr, i) => (
                      <TableCell
                        key={i}
                        className="px-5 py-4 sm:px-6 text-start"
                      >
                        <div className="text-xl">{record[attr]}</div>
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableReport;
