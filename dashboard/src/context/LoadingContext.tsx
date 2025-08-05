import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  FC,
} from "react";

interface ILoadingContext {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

interface ILoadingProviderProps {
  children: ReactNode;
}

const LoadingContext = createContext<ILoadingContext>({
  loading: false,
  showLoading: () => {},
  hideLoading: () => {},
} as ILoadingContext);

// LoadingProvider sẽ chịu trách nhiệm quản lý state loading
export const LoadingProvider: FC<ILoadingProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Các hàm tiện ích để bật/tắt trạng thái loading
  // const showLoading = () => setLoading(true);
  const showLoading = useCallback(() => {
    setLoading(true);
  }, []);
  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook này giúp các component dễ dàng truy xuất context loading
export const useLoading = () => useContext(LoadingContext);
