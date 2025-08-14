export type User = {
  id?: number;
  username: string;
  password?: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  phone: string | null;
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
};
