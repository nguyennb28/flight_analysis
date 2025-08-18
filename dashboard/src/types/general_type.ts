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
  passenger_pnrs: any[] | null;
  passengers: any[] | null;
};
