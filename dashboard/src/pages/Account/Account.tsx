import { useState, useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import { useForm, SubmitHandler } from "react-hook-form";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Swal from "sweetalert2";
import axiosInstance from "../../instance/axiosInstance";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import TableAccount from "./TableAccount";

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
  const [users, setUsers] = useState<any[] | null>(null);
  const [account, setAccount] = useState<any>(null);

  // Constant
  const ROLES = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];
  const headers = [
    "Lựa chọn",
    "STT",
    "Tài khoản",
    "Họ và tên",
    "Số điện thoại",
    "Quyền hạn",
    "Tính năng",
  ];

  // Navigate
  const navigate = useNavigate();

  // Context
  const { user } = useAuth();

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      role: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createAccount(data);
  };

  const createAccount = async (data: Inputs) => {
    if (data) {
      try {
        const response = await axiosInstance.post(`/users/`, {
          ...data,
        });
        if (response.status == 201 || response.status == 200) {
          Swal.fire({
            icon: "success",
            title: "Thông báo",
            text: "Cập nhật thành công",
            timer: 1000,
          });
          window.location.reload();
        }
      } catch (err: any) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Thông báo",
          text: "Có lỗi trong quá trình tạo tài khoản",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Hãy cung cấp đầy đủ thông tin để tạo tài khoản",
      });
      return;
    }
  };

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get(`/users/`);
      if (response.status == 200) {
        setUsers(response.data.results);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const closeModalCreate = () => {
    setIsCreate(false);
    refreshState();
  };

  const closeModalUpdate = () => {
    setIsUpdate(true);
    refreshState();
  };

  const refreshState = () => {
    reset({
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      role: "",
    });
  };

  const featureDetail = async (id: string | number) => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Không có id tài khoản",
      });
      return;
    }
    try {
      const response = await axiosInstance.get(`/users/${id}/`);
      if (response.status == 200 || response.status == 201) {
        setAccount(response.data);
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Không xem được chi tiết tài khoản",
      });
    }
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
      return;
    }
    getUsers();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role !== "admin") {
        Swal.fire({
          icon: "error",
          title: "Thông báo",
          text: "Không được sử dụng tính năng này",
        });
        navigate("/", { replace: true });
      }
    }
  }, [user]);

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* Username */}
                  <div>
                    <label className="label-form">Tên tài khoản</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nhập tên tài khoản"
                      {...register("username", {
                        required: "Nhập tên tài khoản",
                      })}
                    />
                    {errors.username && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  {/* Password */}
                  <div>
                    <label className="label-form">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Nhập mật khẩu"
                      {...register("password")}
                    />
                  </div>
                  {/* First name */}
                  <div>
                    <label className="label-form">Họ</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nhập họ"
                      {...register("first_name", {
                        required: "Nhập họ",
                      })}
                    />
                    {errors.first_name && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  {/* Last name */}
                  <div>
                    <label className="label-form">Tên</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nhập tên"
                      {...register("last_name", {
                        required: "Nhập tên",
                      })}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="label-form">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nhập số điện thoại"
                      {...register("phone", {
                        required: "Nhập số điện thoại",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Số điện thoại chỉ được chứa số",
                        },
                        minLength: {
                          value: 9,
                          message: "Số điện thoại tối thiểu 9 chữ số",
                        },
                        maxLength: {
                          value: 15,
                          message: "Số điện thoại tối đa 15 chữ số",
                        },
                      })}
                    />
                    {errors.phone && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  {/* Role */}
                  <div>
                    <label className="label-form">Phân quyền</label>
                    <select {...register("role")} className="form-input">
                      <option value="">--- Chọn ---</option>
                      {ROLES.map((item, index) => (
                        <option value={item.value} key={index}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/*  */}
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 md:justify-end">
                <button
                  type="submit"
                  className="px-5 py-3.5 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                >
                  Lưu
                </button>
                <Button size="md" variant="outline" onClick={closeModalCreate}>
                  Đóng
                </Button>
              </div>
            </div>
          </form>
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
      <div className="rounded-2xl mt-5 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {users ? (
          <TableAccount
            headers={headers}
            users={users}
            onDelete={() => {}}
            onEdit={() => {}}
          />
        ) : (
          <div>
            <h4 className="text-red-500 text-xl">Không có dữ liệu</h4>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
