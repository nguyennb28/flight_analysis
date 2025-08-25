import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import axiosInstance from "../instance/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

interface IUser {
  [key: string]: any;
}

interface ITokenPayload {
  exp: number;
  [key: string]: any;
}

interface IAuthContext {
  user: IUser | null;
  userLoading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ access: string; refresh: string; user: IUser }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  checkRole: () => void;
  checkAdmin: () => void;
  countTimeToRefresh: () => number;
  callRefreshToken: () => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

// const AuthContext = createContext<IAuthContext | undefined>(undefined);
const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const login = async (
    username: string,
    password: string
  ) => {
    try {
      const { data: tokenData } = await axiosInstance.post("/token/", {
        username,
        password,
      });
      const { access, refresh } = tokenData;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const { data: userData } = await axiosInstance.get("/users/me/");
      setUser(userData);
      return { access, refresh, user: userData };
    } catch (err: any) {
      throw new Error(err.reponse?.data?.detail || "Đăng nhập thất bại");
    }
  };
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const callRefreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      const { data: response } = await axiosInstance.post(`/token/refresh/`, {
        refresh,
      });
      const { access } = response;
      localStorage.setItem("access", access);
      window.location.reload();
    } catch (err) {
      console.error(
        `Không lấy được refresh token hoặc có thể không call được api ${err}`
      );
      throw err;
    }
  };

  const countTimeToRefresh = () => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      logout();
      const navigate = useNavigate();
      navigate("/signin", { replace: true });
      return 0;
    } else {
      const decoded: ITokenPayload = jwtDecode(accessToken);
      const tokenExpiration = decoded.exp * 1000; //convert to milliseconds
      const now = Date.now();
      const timeUntilExpiration = tokenExpiration - now;
      const timeToRefresh = timeUntilExpiration - 60000;
      const refreshTime = timeUntilExpiration > 0 ? timeToRefresh : 0;

      return refreshTime;
    }
  };

  const checkAuth = async () => {
    const access = localStorage.getItem("access");
    if (!access) {
      logout();
      const navigate = useNavigate();
      navigate("/signin", { replace: true });
      return;
    }
    try {
      const decoded: ITokenPayload = jwtDecode(access);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;
      if (tokenExpiration !== undefined && tokenExpiration < now) {
        await callRefreshToken();
      }
    } catch (err) {
      console.error(`Token không hợp lệ hoặc xảy ra lỗi khi decode: ${err}`);
      logout();
    }
  };

  const checkRole = () => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
    }
    if (user && user.role === "user") {
      logout();
      navigate("/signin", { replace: true });
    }
  };

  const checkAdmin = () => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/signin", { replace: true });
    }
    if (user && user.role !== "admin") {
      logout();
      navigate("/signin", { replace: true });
      window.location.reload();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // await checkAuth();
        const access = localStorage.getItem("access");
        if (access) {
          const { data: response } = await axiosInstance.get("/users/me/");
          setUser(response);
        }
      } catch (err) {
        console.error(`Lỗi khi kiểm tra xác thực: ${err}`);
        logout();
      } finally {
        setUserLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    userLoading,
    login,
    logout,
    checkAuth,
    setUser,
    checkRole,
    checkAdmin,
    countTimeToRefresh,
    callRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
