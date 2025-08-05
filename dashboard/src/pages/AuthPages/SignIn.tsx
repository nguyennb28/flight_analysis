import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (username: string, password: string) => {
    try {
      const response = await login(username, password);
      if (response) {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: "Hãy kiểm tra lại tài khoản hoặc mật khẩu",
      });
    }
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm onSubmit={onSubmit}/>
      </AuthLayout>
    </>
  );
}
