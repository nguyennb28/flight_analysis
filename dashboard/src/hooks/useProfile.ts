import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../instance/axiosInstance";

const useProfile = (trigger: boolean) => {
  const [profile, setProfile] = useState(null);

  const callMe = async () => {
    if (!trigger) {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Hãy kích hoạt trigger = true để gọi profile",
      });
      return;
    }
    try {
      const response = await axiosInstance.get(`/users/me/`);
      if (response.status == 200) {
        setProfile(response.data);
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Có lỗi trong quá trình gọi thông tin người dùng",
      });
      console.error(err);
    }
  };

  useEffect(() => {
    if (trigger) callMe();
  }, [trigger]);

  return [profile];
};

export default useProfile;
