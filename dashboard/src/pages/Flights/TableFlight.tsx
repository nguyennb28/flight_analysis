import { MdDelete, MdRemoveRedEye } from "react-icons/md";

interface Flight {
  id: number;
  brand: string | null;
  nationality_label: string | null;
  flight_number: string | null;
  flight_date: string | null;
  departure_point: string | null;
  destination_point: string | null;
  flight_path: string | null;
  trasit_place: string | null;
}

interface Props {
  flights: Flight[] | null;
}

const TableFlight = ({ flights }: Props) => {
  if (!flights) {
    return (
      <div className="text-2xl font-bold uppercase text-red-500">
        Không có dữ liệu từ cơ sở dữ liệu
      </div>
    );
  } else {
    console.log(flights[0].brand);
  }

  return (
    <>
      <div className="">
        <div className="header grid grid-cols-7 gap-1 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="py-3 font-medium text-black text-start text-lg dark:text-gray-400 uppercase">
            STT
          </h3>
          <h3 className="py-3 font-medium text-black text-start text-lg dark:text-gray-400 uppercase">
            Hãng vận chuyển
          </h3>
          <h3 className="py-3 font-medium text-black text-start text-lg dark:text-gray-400 uppercase">
            Số chuyến bay
          </h3>
          <h3 className="py-3 font-medium text-black text-start text-lg dark:text-gray-400 uppercase">
            Ngày bay
          </h3>
          <h3 className="py-3 font-medium text-black text-start text-lg dark:text-gray-400 uppercase">
            Nơi đi
          </h3>
          <h3 className="py-3 font-medium text-black text-start text-lg dark:text-gray-400 uppercase">
            Nơi đến
          </h3>
          <h3 className="py-3 font-medium text-black text-start text-lg dark:text-gray-400 uppercase">
            Tính năng
          </h3>
        </div>
        <div className="body grid grid-cols-7 gap-1 max-h-[400px] overflow-auto justify-center">
          {flights.map((flight, index) => (
            <>
              <p className="border-b-2 border-r-2 p-3">{index}</p>
              <p className="border-b-2 border-r-2 p-3">{flight.brand}</p>
              <p className="border-b-2 border-r-2 p-3">
                {flight.flight_number}
              </p>
              <p className="border-b-2 border-r-2 p-3">{flight.flight_date}</p>
              <p className="border-b-2 border-r-2 p-3">
                {flight.departure_point}
              </p>
              <p className="border-b-2 border-r-2 p-3">
                {flight.destination_point}
              </p>
              <div className="flex border-b-2 border-r-2 p-3 justify-center">
                <button className="block" type="button">
                  <MdDelete size={30} className="text-red-800" />
                </button>
                <button className="block ml-5" type="button">
                  <MdRemoveRedEye size={30} className="text-sky-800" />
                </button>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default TableFlight;
