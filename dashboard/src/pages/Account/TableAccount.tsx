import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { MdDelete } from "react-icons/md";
import { FaEye, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

type User = {
  id: number;
  username: string;
  password: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
};

interface Props {
  headers: string[];
  users: User[] | null;
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number) => void;
}

// Define the table data using the interface
const TableAccount = ({ headers, users, onDelete, onEdit }: Props) => {
  const handleDelete = (id: string | number) => {
    Swal.fire({
      icon: "warning",
      title: "Thông báo",
      text: "Bạn có chắc với quyết định của mình ?",
      confirmButtonText: "Xóa",
      confirmButtonColor: "#E62727",
      showDenyButton: true,
      denyButtonText: "Quay lại",
      denyButtonColor: "#44444E",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
      } else {
        return;
      }
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            {headers.map((header, idx) => (
              <TableCell
                key={idx}
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-lg dark:text-gray-400"
              >
                {header}
              </TableCell>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users &&
              users.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3 dark:text-white">
                      {index}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3 dark:text-white">
                      {record.username}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3 dark:text-white">
                      {record.full_name}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3 dark:text-white">
                      {record.phone ? (
                        record.phone
                      ) : (
                        <span className="text-red-500 italic">
                          Không có thông tin
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3 dark:text-white">
                      {record.role}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start grid grid-cols-1 md:grid-cols-2">
                    <div>
                      {/* <button onClick={() => onDelete(record.id)}> */}
                      <button onClick={() => handleDelete(record.id)}>
                        <MdDelete
                          size={30}
                          className="text-red-800 dark:text-red-400"
                        />
                      </button>
                    </div>
                    <div>
                      <button>
                        <FaEdit size={30} className="text-zinc-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default TableAccount;
