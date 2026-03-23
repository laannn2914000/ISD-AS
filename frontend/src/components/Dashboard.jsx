import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  Search,
  Bell,
  Loader2,
  FilePlus,
  History
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin Admin từ localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "System Admin",
    role: "admin",
  };
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard-stats`);
        setData(res.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu Admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [API_URL]);

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-left">
        <Loader2 className="animate-spin text-[#0061f2] mb-4" size={40} />
        <p className="text-gray-500 font-medium">Đang khởi tạo hệ thống quản trị...</p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-left relative">
      
      {/* SIDEBAR - Cập nhật màu Vàng cho Admin */}
      <aside className="w-[280px] bg-yellow-400 border-r border-yellow-500/20 p-6 flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-yellow-400 font-bold text-xl shadow-lg">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">APMS</h1>
            <p className="text-[10px] text-gray-700 uppercase tracking-widest font-semibold">
              ADMIN SYSTEM
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          />
          <NavItem icon={<FileText size={20} />} label="Chứng từ kế toán" />
          <NavItem icon={<BookOpen size={20} />} label="Sổ sách kế toán" />
          <NavItem icon={<Users size={20} />} label="Quản lý công nợ" />
          <NavItem icon={<BarChart3 size={20} />} label="Báo cáo tài chính" />
          <NavItem icon={<UserCheck size={20} />} label="Phê duyệt báo cáo" />
          <NavItem
            icon={<Users size={20} />}
            label="Quản lý nhân viên"
            active={location.pathname === "/employee-management"}
            onClick={() => navigate("/employee-management")}
          />
          <NavItem icon={<Settings size={20} />} label="Cài đặt hệ thống" />
        </nav>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 text-gray-900 p-4 hover:bg-black/10 rounded-xl transition-all mt-auto font-bold active:scale-95"
        >
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">
        {/* HEADER */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo hoặc chứng từ..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2] text-sm"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">{user.fullName}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">ADMIN</p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8 text-left">
          <section>
            <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Financial Overview</h2>
            <p className="text-gray-400 text-sm mt-1.5 font-normal">Biểu đồ phân tích tài chính toàn hệ thống</p>
          </section>

          {/* BIỂU ĐỒ */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentDocsTable />
            <ApprovalRequestsTable />
          </div>
        </main>
      </div>

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Xác nhận đăng xuất</h3>
            <p className="text-sm text-gray-400 mt-2">Bạn muốn đăng xuất đúng không?</p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3.5 font-bold text-gray-500 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all active:scale-95">Trở lại</button>
              <button onClick={confirmLogout} className="flex-1 py-3.5 font-bold text-white bg-red-500 rounded-2xl shadow-lg hover:bg-red-600 transition-all active:scale-95">Đăng xuất</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTS CON ---
const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-yellow-500 text-white font-bold shadow-sm"
        : "text-gray-800 hover:bg-yellow-500/20 hover:text-gray-900"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const RecentDocsTable = () => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
    <h3 className="font-bold text-gray-800 text-lg mb-6">Chứng từ kế toán gần đây</h3>
    <table className="w-full text-left">
      <thead>
        <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
          <th className="pb-4">Mã chứng từ</th>
          <th className="pb-4">Phòng ban</th>
          <th className="pb-4">Người tạo</th>
          <th className="pb-4">Trạng thái</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        <tr className="text-sm">
          <td className="py-4 font-medium text-gray-600">DOC-1240</td>
          <td className="py-4 text-gray-500">Kế toán</td>
          <td className="py-4 text-gray-500">Vũ Trí Kiên</td>
          <td className="py-4 text-orange-500 font-bold">Chờ duyệt</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const ApprovalRequestsTable = () => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
    <h3 className="font-bold text-gray-800 text-lg mb-6">Yêu cầu phê duyệt</h3>
    <table className="w-full text-left">
      <thead>
        <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
          <th className="pb-4">Tên báo cáo</th>
          <th className="pb-4">Số tiền</th>
          <th className="pb-4">Người gửi</th>
          <th className="pb-4">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-sm">
          <td className="py-4 font-medium text-gray-500">Báo cáo quý 1</td>
          <td className="py-4 font-bold text-gray-800">45,000,000</td>
          <td className="py-4 text-gray-500">Nguyễn Văn A</td>
          <td className="py-4 text-[#0061f2] font-bold cursor-pointer">Xem</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const chartData = [
  { name: "Jan", value: 45 }, { name: "Feb", value: 52 }, { name: "Mar", value: 48 },
  { name: "Apr", value: 62 }, { name: "May", value: 55 }, { name: "Jun", value: 68 },
  { name: "Jul", value: 58 }, { name: "Aug", value: 65 }, { name: "Sep", value: 71 },
  { name: "Oct", value: 66 }, { name: "Nov", value: 73 }, { name: "Dec", value: 80 },
];

export default Dashboard;