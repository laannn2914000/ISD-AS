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
  Clock,
  FileSearch,
  Loader2,
  Plus,
  TrendingUp,
  X, // Đã thêm X để dùng cho nút đóng popup
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

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Manager",
    role: "manager",
    email: "",
  };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/manager/stats`);
        setData(res.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu Manager:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, [API_URL]);

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-left">
        <Loader2 className="animate-spin text-[#0061f2] mb-4" size={40} />
        <p className="text-gray-500 font-medium">Đang tải dữ liệu quản lý...</p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-left relative">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-[#0061f2] border-r border-white/10 p-6 flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0061f2] font-bold text-xl shadow-lg">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">KTBM</h1>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">
              Quản lý
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={location.pathname === "/manager-dashboard"}
            onClick={() => navigate("/manager-dashboard")}
          />
          
          <NavItem 
            icon={<Users size={20} />} 
            label="Quản lý nhân viên" 
            active={location.pathname === "/manager-employee-management"}
            onClick={() => navigate("/manager-employee-management")}
          />

          <NavItem icon={<UserCheck size={20} />} label="Phê duyệt báo cáo" />
          <NavItem icon={<BarChart3 size={20} />} label="Báo cáo tài chính" />
          <NavItem icon={<FileSearch size={20} />} label="Kiểm soát chứng từ" />
          <NavItem icon={<Settings size={20} />} label="Cài đặt" />
        </nav>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 text-white p-4 hover:bg-white/10 rounded-xl transition-all mt-auto font-bold active:scale-95"
        >
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm dữ liệu quản lý..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2] text-sm"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">Người dùng</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">Quản lý</p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                M
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8 text-left">
          <section>
            <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Dashboard</h2>
            <p className="text-gray-400 text-sm mt-1.5 font-normal">Tổng hợp và phê duyệt báo cáo hệ thống</p>
          </section>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
                        <Line type="monotone" dataKey="value" stroke="#0061f2" strokeWidth={4} dot={{ r: 6, fill: "#0061f2", strokeWidth: 2, stroke: "#fff" }} />
                    </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivityTable />
            <PendingApprovalTable />
          </div>
        </main>
      </div>

      {/* MODAL ĐĂNG XUẤT ĐÃ CẬP NHẬT THEO THIẾT KẾ CỦA BẠN */}
      {showLogoutModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in duration-200">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogOut size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Xác nhận đăng xuất</h3>
                  <p className="text-gray-500 text-sm mt-2">Bạn có chắc chắn muốn rời khỏi hệ thống KTBM?</p>
                  <div className="flex gap-3 mt-8">
                    <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3.5 font-bold text-gray-500 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Hủy</button>
                    <button onClick={confirmLogout} className="flex-1 py-3.5 font-bold text-white bg-red-500 rounded-2xl shadow-lg hover:bg-red-600 transition-all">Xác nhận</button>
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
        ? "bg-white/20 text-white font-bold shadow-sm"
        : "text-blue-100 hover:bg-white/10 hover:text-white"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const RecentActivityTable = () => (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-left">
        <h3 className="font-bold text-gray-800 text-lg mb-6">Hoạt động gần đây</h3>
        <div className="space-y-4 text-sm text-gray-500 italic">
            Chưa có hoạt động mới...
        </div>
    </div>
);

const PendingApprovalTable = () => (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-left">
        <h3 className="font-bold text-gray-800 text-lg mb-6">Yêu cầu chờ duyệt</h3>
        <div className="space-y-4 text-sm text-gray-500 italic">
            Không có yêu cầu chờ xử lý...
        </div>
    </div>
);

const chartData = [
  { name: "Jan", value: 30 }, { name: "Feb", value: 45 }, { name: "Mar", value: 38 },
  { name: "Apr", value: 50 }, { name: "May", value: 48 }, { name: "Jun", value: 60 },
];

export default ManagerDashboard;