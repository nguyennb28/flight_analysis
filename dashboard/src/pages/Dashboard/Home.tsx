import { MdRemoveRedEye } from "react-icons/md";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      logout();
      navigate("/signin", { replace: true });
    }
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 overflow-y-auto">
        <h3 className="font-semibold uppercase text-lg">
          Hướng dẫn sử dụng phần mềm
        </h3>
        <div className="mt-3 tutorial-1 grid grid-cols-1">
          <h4>1. Thông tin chuyến bay</h4>
          <p>
            - Tải dữ liệu chuyến bay lên trên hệ thống ở trong trang{" "}
            <i className="text-green-800">Thông tin chuyến bay</i>.
          </p>
          <p>
            - Khi dữ liệu được cập nhật, trang web tự động tải lại, thông tin
            của các chuyến bay sẽ được hiển thị, để xem chi tiết hãy ấn vào biểu
            tượng <MdRemoveRedEye size={30} className="text-emerald-600" /> để
            xem chi tiết thông tin chuyến bay được chỉ định
          </p>
        </div>
        <div className="mt-3 tutorial-2 grid grid-cols-1">
          <h4>2. Thống kê số lần đi của khách hàng</h4>
          <p>
            - Ở chức năng này, chỉ cần người dùng cung cấp thông tin chuyến bay,
            thì mặc định hệ thống sẽ tự phân tích ra số lần đi của khách hàng
            trong cơ sở dữ liệu (Toàn bộ thông tin)
          </p>
          <p>
            - Có tùy chọn cho người dùng lọc thông tin thống kê theo mốc thời
            gian được chỉ định (bắt đầu - kết thúc). Lúc này hệ thống sẽ cho ra
            dữ liệu trong khoảng thời gian nhất định có những khách hàng đi vượt
            2 lần đổ lên
          </p>
        </div>
      </div>
    </>
  );
}
