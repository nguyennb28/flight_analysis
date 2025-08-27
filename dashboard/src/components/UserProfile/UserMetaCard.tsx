import { useState } from "react";
import { Modal } from "../ui/modal";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  role: string | null;
  phone: string | null;
}

type Inputs = {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
};

const UserMetaCard = ({
  id,
  username,
  first_name,
  last_name,
  full_name,
  role,
  phone,
}: Props) => {
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src="/images/user/avatar.jpg" alt="user" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {full_name}
              </h4>
              <h5 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {username}
              </h5>
              <p className="invisible">{id}</p>
              <p className="invisible">{first_name}</p>
              <p className="invisible">{last_name}</p>
              <p className="invisible">{role}</p>
              <p className="invisible">{phone}</p>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="border-1 bg-gray-400 rounded-2xl shadow-2xl p-5"
              onClick={() => setIsCreate(true)}
            >
              Tạo tài khoản
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isCreate}
        onClose={() => setIsCreate(false)}
        className="max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div>
            <h4 className="text-2xl uppercase font-bold">Tạo tài khoản </h4>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserMetaCard;
