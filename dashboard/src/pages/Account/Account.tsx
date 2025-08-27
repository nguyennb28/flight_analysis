import { useState, useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import { useForm, SubmitHandler } from "react-hook-form";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

type Inputs = {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
};

const Account = () => {
  // State
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  // Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <>
      <PageMeta title="Tài khoản" description="Tài khoản" />
      <PageBreadcrumb pageTitle="Tài khoản" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Quản lý tài khoản
        </h3>
        <div className="space-y-6">
          <div>
            <button
              className="border-2 p-3 mt-3 rounded-2xl bg-emerald-700 text-white"
              onClick={() => setIsCreate(true)}
            >
              Tạo tài khoản
            </button>
          </div>
        </div>
      </div>
      {/* Create */}
      <Modal
        isOpen={isCreate}
        onClose={() => setIsCreate(false)}
        className="max-w-[1000px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div>
            <h4 className="text-2xl uppercase font-bold">Tạo tài khoản </h4>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}></form>
        </div>
      </Modal>
      {/* Update */}
      <Modal
        isOpen={isUpdate}
        onClose={() => setIsUpdate(false)}
        className="max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div>
            <h4 className="text-2xl uppercase font-bold">
              Cập nhật tài khoản{" "}
            </h4>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Account;
