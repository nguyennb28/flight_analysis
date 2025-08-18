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
          <div className="font-semibold text-xl italic text-amber-700">
            Thông tin chuyến bay
          </div>
          <div className="flight-header grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 border-b border-gray-200 mb-5 pb-5">
            <p className="text-xl font-semibold italic">Hãng vận chuyển</p>
            <p className="text-xl flex flex-col font-semibold italic">
              Nhãn hiệu quốc tịch
            </p>
            <p className="text-xl flex flex-col font-semibold italic">
              Số chuyến bay
            </p>
            <p className="text-xl flex flex-col font-semibold italic">
              Ngày bay
            </p>
            <p className="text-xl flex flex-col font-semibold italic">Nơi đi</p>
            <p className="text-xl flex flex-col font-semibold italic">
              Nơi đến
            </p>
            <p className="text-xl flex flex-col font-semibold italic">
              Đường bay
            </p>
            <p className="text-xl flex flex-col font-semibold italic">
              Nơi quá cảnh
            </p>
          </div>
          {/* Body */}
          <div className="flight-header grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 mb-5 pb-5 text-lg">
            <p>
              {flight.brand ? (
                flight.brand
              ) : (
                <span className="text-red-400 italic">Không có thông tin</span>
              )}
            </p>
            <p>
              {flight.nationality_label ? (
                flight.nationality_label
              ) : (
                <span className="text-red-400 italic">Không có thông tin</span>
              )}
            </p>
            <p>
              {flight.flight_number ? (
                flight.flight_number
              ) : (
                <span className="text-red-400 italic">Không có thông tin</span>
              )}
            </p>
            <p>
              {flight.flight_date ? (
                flight.flight_date
              ) : (
                <span className="text-red-400 italic">Không có thông tin</span>
              )}
            </p>
            <p>
              {flight.departure_point ? (
                flight.departure_point
              ) : (
                <span className="text-red-400 italic">Không có thông tin</span>
              )}
            </p>
            <p>
              {flight.destination_point ? (
                flight.destination_point
              ) : (
                <span className="text-red-400 italic">Không có thông tin</span>
              )}
            </p>
            <p>
              {flight.flight_path ? (
                flight.flight_path
              ) : (
                <span className="text-red-400 italic">Không có thông tin</span>
              )}
            </p>
            <p>
              {flight.trasit_place ? (
                flight.trasit_place
              ) : (
                <span className="text-red-400 italic">Không có thông tin</span>
              )}
            </p>
          </div>
          {/* General info */}
          <div className="font-semibold text-xl italic text-amber-700">
            Thông tin chung
          </div>
          {/* General info header */}
          <div className="general-infos-header grid grid-cols-1 md:grid-cols-5 border-b border-gray-200 mb-5 pb-5 text-lg">
            <p className="text-xl font-semibold italic">Số khách</p>
            <p className="text-xl font-semibold italic">Điểm đi</p>
            <p className="text-xl font-semibold italic">Nơi xuất cảnh</p>
            <p className="text-xl font-semibold italic">Nơi đến</p>
            <p className="text-xl font-semibold italic">Nơi nhập</p>
          </div>
          {/* General info body */}
          <div className="general-infos-body grid grid-cols-1 md:grid-cols-5 mb-5 pb-5 text-lg">
            {flight.general_infos
              ? flight.general_infos.map((item, idx) => (
                  <>
                    <p>
                      {item.number_of_guests ? (
                        item.number_of_guests
                      ) : (
                        <span className="text-red-400 italic">
                          Không có thông tin
                        </span>
                      )}
                    </p>
                    <p>
                      {item.departure_point ? (
                        item.departure_point
                      ) : (
                        <span className="text-red-400 italic">
                          Không có thông tin
                        </span>
                      )}
                    </p>
                    <p>
                      {item.place_of_origin ? (
                        item.place_of_origin
                      ) : (
                        <span className="text-red-400 italic">
                          Không có thông tin
                        </span>
                      )}
                    </p>
                    <p>
                      {item.destination_point ? (
                        item.destination_point
                      ) : (
                        <span className="text-red-400 italic">
                          Không có thông tin
                        </span>
                      )}
                    </p>
                    <p>
                      {item.place_of_entry ? (
                        item.place_of_entry
                      ) : (
                        <span className="text-red-400 italic">
                          Không có thông tin
                        </span>
                      )}
                    </p>
                  </>
                ))
              : "Không có dữ liệu"}
          </div>
          {/* Member */}
          <div className="font-semibold text-xl italic text-amber-700">
            Danh sách thành viên tổ bay:
            <span className="text-emerald-700"> {flight.members?.length}</span>
          </div>
          {/* Member header */}
          <div className="member-header grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 border-b border-gray-200 mb-5 pb-5 text-lg">
            <p className="text-xl font-semibold italic">Tên</p>
            <p className="text-xl font-semibold italic">Giới tính</p>
            <p className="text-xl font-semibold italic">Quốc tịch</p>
            <p className="text-xl font-semibold italic">Ngày sinh</p>
            <p className="text-xl font-semibold italic">Số giấy tờ</p>
            <p className="text-xl font-semibold italic">Loại giấy tờ</p>
            <p className="text-xl font-semibold italic">Nơi cấp</p>
            <p className="text-xl font-semibold italic">Ngày hết hạn</p>
          </div>
          {/* Member body */}
          <div className="general-infos-body grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 mb-5 pb-5 text-lg">
            {flight.members ? (
              flight.members.map((member, index) => (
                <>
                  <p className="mb-2">
                    {member.name ? (
                      member.name
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {member.sex ? (
                      member.sex
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {member.nationality ? (
                      member.nationality
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {member.date_of_birth ? (
                      member.date_of_birth
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {member.number_of_document ? (
                      member.number_of_document
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {member.type_of_document ? (
                      member.type_of_document
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {member.place_of_issue ? (
                      member.place_of_issue
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {member.expiration_date ? (
                      member.expiration_date
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                </>
              ))
            ) : (
              <p className="text-red-400 font-bold text-xl">
                Không có thông tin
              </p>
            )}
          </div>
          {/* Passenger */}
          <div className="font-semibold text-xl italic text-amber-700">
            Danh sách hành khách:
            <span className="text-emerald-700">
              {" "}
              {flight.passengers?.length}
            </span>
          </div>
          {/* Passenger header */}
          <div className="passenger-header grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 border-b border-gray-200 mb-5 pb-5 text-lg">
            <p className="text-xl font-semibold italic">Số ghế</p>
            <p className="text-xl font-semibold italic">Tên</p>
            <p className="text-xl font-semibold italic">Giới tính</p>
            <p className="text-xl font-semibold italic">Quốc tịch</p>
            <p className="text-xl font-semibold italic">Ngày sinh</p>
            <p className="text-xl font-semibold italic">Loại giấy tờ</p>
            <p className="text-xl font-semibold italic">Số giấy tờ</p>
            <p className="text-xl font-semibold italic">Nơi cấp</p>
            <p className="text-xl font-semibold italic">Nơi đi</p>
            <p className="text-xl font-semibold italic">Nơi đến</p>
            <p className="text-xl font-semibold italic">Hành lý</p>
            <p className="text-xl font-semibold italic">Ngày hết hạn</p>
          </div>
          {/* Passenger body */}
          <div className="passenger-body grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 mb-5 pb-5 text-lg">
            {flight.passengers ? (
              flight.passengers.map((passenger, idx) => (
                <>
                  <p className="mb-2">
                    {passenger.number_of_seat ? (
                      passenger.number_of_seat
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.name ? (
                      passenger.name
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.sex ? (
                      passenger.sex
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.nationality ? (
                      passenger.nationality
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.date_of_birth ? (
                      passenger.date_of_birth
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.type_of_document ? (
                      passenger.type_of_document
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.number_of_document ? (
                      passenger.number_of_document
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.place_of_issue ? (
                      passenger.place_of_issue
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.departure_point ? (
                      passenger.departure_point
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.destination_point ? (
                      passenger.destination_point
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2 whitespace-normal break-words">
                    {passenger.luggage ? (
                      passenger.luggage
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {passenger.expiration_date ? (
                      passenger.expiration_date
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                </>
              ))
            ) : (
              <p className="text-red-400 font-bold text-xl">
                Không có thông tin
              </p>
            )}
          </div>

          {/* PassengerPNR */}
          <div className="font-semibold text-xl italic text-amber-700">
            Danh sách PNR:
            <span className="text-emerald-700">
              {" "}
              {flight.passenger_pnrs?.length}
            </span>
          </div>
          {/* PassengerPNR header */}
          <div className="passengerpnr-header grid grid-cols-1 md:grid-cols-4 lg:grid-cols-11 border-b border-gray-200 mb-5 pb-5 text-lg">
            <p className="text-xl font-semibold italic">Mã đặt chỗ</p>
            <p className="text-xl font-semibold italic">Ngày đặt chỗ</p>
            <p className="text-xl font-semibold italic">Thông tin vé</p>
            <p className="text-xl font-semibold italic">Tên hành khách</p>
            <p className="text-xl font-semibold italic">Tên khác</p>
            <p className="text-xl font-semibold italic">Hành trình bay</p>
            <p className="text-xl font-semibold italic">Địa chỉ</p>
            <p className="text-xl font-semibold italic">Điện thoại</p>
            <p className="text-xl font-semibold italic">Thông tin liên hệ</p>
            <p className="text-xl font-semibold italic">Số lượng</p>
            <p className="text-xl font-semibold italic">Mã người đặt chỗ</p>
          </div>
          {/* PassengerPNR body */}
          <div className="passenger-body grid grid-cols-1 md:grid-cols-5 lg:grid-cols-11 mb-5 pb-5 text-lg">
            {flight.passenger_pnrs ? (
              flight.passenger_pnrs.map((pnr, idx) => (
                <>
                  <p className="mb-2">
                    {pnr.booking_code ? (
                      pnr.booking_code
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {pnr.booking_date ? (
                      pnr.booking_date
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {pnr.ticket_info ? (
                      pnr.ticket_info
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2 whitespace-normal break-words">
                    {pnr.name ? (
                      pnr.name
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {pnr.another_name ? (
                      pnr.another_name
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {pnr.flight_itinerary ? (
                      pnr.flight_itinerary
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {pnr.address ? (
                      pnr.address
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2 whitespace-normal break-words">
                    {pnr.phone_email ? (
                      pnr.phone_email
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2 whitespace-normal break-words">
                    {pnr.contact_info ? (
                      pnr.contact_info
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {pnr.number_of_passengers_sharing_booking_code ? (
                      pnr.number_of_passengers_sharing_booking_code
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    {pnr.booker_code ? (
                      pnr.booker_code
                    ) : (
                      <span className="text-red-400 italic">
                        Không có thông tin
                      </span>
                    )}
                  </p>
                </>
              ))
            ) : (
              <p className="text-red-400 font-bold text-xl">
                Không có thông tin
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default FlightDetail;
