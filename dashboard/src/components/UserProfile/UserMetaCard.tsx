import { useModal } from "../../hooks/useModal";
interface Props {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  role: string | null;
  phone: string | null;
}

const UserMetaCard = ({
  id,
  username,
  first_name,
  last_name,
  full_name,
  role,
  phone,
}: Props) => {
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMetaCard;
