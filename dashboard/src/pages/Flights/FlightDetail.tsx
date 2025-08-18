import { FlightType } from "../../types/general_type";

interface Props {
  flight: FlightType | null;
}

const FlightDetail = ({ flight }: Props) => {
  return (
    <>
      {flight && (
        <>
          {/* Header */}
          <div className="flight-header grid grid-cols-8 border-b border-gray-200 mb-5 pb-5">
            <div className="text-xl font-semibold italic">
              Hãng vận chuyển
              {/* <p>{flight.brand}</p> */}
            </div>
            <div className="text-xl flex flex-col font-semibold italic">
              Nhãn hiệu quốc tịch
              {/* <p>{flight.nationality_label}</p> */}
            </div>
            <div className="text-xl flex flex-col font-semibold italic">
              Số chuyến bay
              {/* <p>{flight.flight_number}</p> */}
            </div>
            <div className="text-xl flex flex-col font-semibold italic">
              Ngày bay
              {/* <p>{flight.flight_date}</p> */}
            </div>
            <div className="text-xl flex flex-col font-semibold italic">
              Nơi đi
              {/* <p>{flight.departure_point}</p> */}
            </div>
            <div className="text-xl flex flex-col font-semibold italic">
              Nơi đến
              {/* <p>{flight.destination_point}</p> */}
            </div>
            <div className="text-xl flex flex-col font-semibold italic">
              Đường bay
              {/* <p>{flight.flight_path}</p> */}
            </div>
            <div className="text-xl flex flex-col font-semibold italic">
              Nơi quá cảnh
              {/* <p>{flight.trasit_place}</p> */}
            </div>
          </div>
          {/* Body */}
          <div className="flight-header grid grid-cols-8 border-b border-gray-200 mb-5 pb-5 text-lg">
            <p>{flight.brand ? flight.brand : "Không có thông tin"}</p>
            <p>
              {flight.nationality_label
                ? flight.nationality_label
                : "Không có thông tin"}
            </p>
            <p>
              {flight.flight_number
                ? flight.flight_number
                : "Không có thông tin"}
            </p>
            <p>
              {flight.flight_date ? flight.flight_date : "Không có thông tin"}
            </p>
            <p>
              {flight.departure_point
                ? flight.departure_point
                : "Không có thông tin"}
            </p>
            <p>
              {flight.destination_point
                ? flight.destination_point
                : "Không có thông tin"}
            </p>
            <p>
              {flight.flight_path ? flight.flight_path : "Không có thông tin"}
            </p>
            <p>
              {flight.trasit_place ? flight.trasit_place : "Không có thông tin"}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default FlightDetail;
