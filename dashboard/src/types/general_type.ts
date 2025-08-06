export type User = {
  id?: number;
  username: string;
  password?: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  phone: string | null;
};
