import React, { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Swal from "sweetalert2";

interface SignInFormProps {
  onSubmit: (username: string, password: string) => void;
}

const SignInForm = ({ onSubmit }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleUsername = (value: string) => {
    setUsername(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: "error",
        title: "Tài khoản hoặc mật khẩu không có",
        text: "Vui lòng cung cấp tài khoản hoặc mật khẩu",
      });
      return;
    }
    onSubmit(username, password);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Tài khoản <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleUsername(e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handlePassword(e.target.value)
                      }
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
