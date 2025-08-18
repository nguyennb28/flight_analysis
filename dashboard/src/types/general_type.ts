export type User = {
  id?: number;
  username: string;
  password?: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  phone: string | null;
};

export type GeneralInfoType = {
  id: number;
  number_of_guests: number | null;
  departure_point: string | null;
  place_of_origin: string | null;
  destination_point: string | null;
  place_of_entry: string | null;
};

export type MemberType = {
  id: number;
  name: string | null;
  sex: string | null;
  nationality: string | null;
  date_of_birth: string | null;
  number_of_document: string | null;
  type_of_document: string | null;
  place_of_issue: string | null;
  expiration_date: string | null;
};

export type PassengerType = {
  number_of_seat: string | null;
  name: string | null;
  sex: string | null;
  nationality: string | null;
  date_of_birth: string | null;
  type_of_document: string | null;
  number_of_document: string | null;
  place_of_issue: string | null;
  country_of_residence: string | null;
  departure_point: string | null;
  destination_point: string | null;
  first_airport: string | null;
  luggage: string | null;
  expiration_date: string | null;
};

export type PassengerPNRType = {
  booking_code: string | null;
  booking_date: string | null;
  ticket_info: string | null;
  name: string | null;
  another_name: string | null;
  flight_itinerary: string | null;
  address: string | null;
  phone_email: string | null;
  contact_info: string | null;
  number_of_passengers_sharing_booking_code: string | null;
  booker_code: string | null;
  number_of_seat: string | null;
  luggage_info: string | null;
  note: string | null;
};

export type FlightType = {
  id: number;
  brand: string | null;
  nationality_label: string | null;
  flight_number: string | null;
  flight_date: string | null;
  departure_point: string | null;
  destination_point: string | null;
  flight_path: string | null;
  trasit_place: string | null;
  general_infos: GeneralInfoType[] | null;
  members: MemberType[] | null;
  passenger_pnrs: PassengerPNRType[] | null;
  passengers: PassengerType[] | null;
};
