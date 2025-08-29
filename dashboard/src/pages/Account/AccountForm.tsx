import Swal from "sweetalert2";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../../components/ui/button/Button";

type Inputs = {
  id: number | string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
};

interface Props {
  record: Inputs;
}

const AccountForm = () => {
  const ROLES = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  
  
  return <>
    <form></form>
  </>;
};

export default AccountForm;
