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
  X,
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

  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "System Admin",
    role: "admin",
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu Admin:", err);
        setData(null);
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
        <p className="text-gray-500 font-medium">
          Đang khởi tạo hệ thống quản trị...
        </p>
      </div>
    );

  // --- BIỂU ĐỒ DỮ LIỆU THỰC TẾ ---
  const chartData = [
    { name: "Đã duyệt", value: data?.approvedReports || 0 },
    { name: "Chờ duyệt", value: data?.pendingReports || 0 },
    { name: "Từ chối", value: data?.rejectedReports || 0 },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-left relative">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-yellow-400 border-r border-yellow-500/20 p-6 flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-yellow-400 font-bold text-xl shadow-lg">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">
              KTBM
            </h1>
            <p className="text-[10px] text-gray-700 uppercase tracking-widest font-semibold mt-1">
              ADMIN
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
          <NavItem
            icon={<FileText size={20} />}
            label="Chứng từ kế toán"
            disabled
          />
          <NavItem
            icon={<BookOpen size={20} />}
            label="Sổ sách kế toán"
            disabled
          />
          <NavItem
            icon={<Users size={20} />}
            label="Quản lý công nợ"
            disabled
          />
          <NavItem
            icon={<BarChart3 size={20} />}
            label="Báo cáo tài chính"
            active={location.pathname === "/admin-finance-reports"}
            onClick={() => navigate("/admin-finance-reports")}
          />
          <NavItem
            icon={<UserCheck size={20} />}
            label="Phê duyệt báo cáo"
            active={location.pathname === "/report-system"}
            onClick={() => navigate("/report-system")}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Quản lý nhân viên"
            active={location.pathname === "/employee-management"}
            onClick={() => navigate("/employee-management")}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Cài đặt hệ thống"
            disabled
          />
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
          <div className="relative flex-1 max-w-2xl">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">
                  Admin
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                A
              </div>
            </div>
          </div>
        </header>
        <main className="p-10 space-y-8 text-left">
          <section>
            <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Tổng quan hệ thống
            </h2>
            <p className="text-gray-400 text-sm mt-1.5 font-normal">
              Thống kê tổng hợp và biểu đồ phân tích tài chính toàn hệ thống
            </p>
          </section>

          {/* Thống kê tổng hợp */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              label="Quản lý"
              value={data?.totalManagers || 0}
              color="bg-yellow-100 text-yellow-700"
            />
            <StatCard
              label="Nhân viên"
              value={data?.totalEmployees || 0}
              color="bg-blue-100 text-blue-700"
            />
            <StatCard
              label="Tài khoản bị khóa"
              value={data?.lockedUsers || 0}
              color="bg-red-100 text-red-700"
            />
            <StatCard
              label="Tổng báo cáo"
              value={data?.totalReports || 0}
              color="bg-green-100 text-green-700"
            />
          </div>

          {/* BIỂU ĐỒ */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={4}
                    dot={{
                      r: 6,
                      fill: "#ef4444",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bảng thống kê báo cáo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentDocsTable data={data} />
            <ApprovalRequestsTable data={data} />
          </div>
        </main>
      </div>

      {/* POPUP XÁC NHẬN ĐĂNG XUẤT */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Xác nhận đăng xuất
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Bạn có chắc chắn muốn rời khỏi hệ thống KTBM?
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3.5 font-bold text-gray-500 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3.5 font-bold text-white bg-red-500 rounded-2xl shadow-lg hover:bg-red-600 transition-all"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- COMPONENTS ---
  function StatCard({ label, value, color }) {
    return (
      <div
        className={`rounded-2xl p-6 flex flex-col items-center shadow-sm border border-gray-100 ${color}`}
      >
        <span className="text-xs font-semibold uppercase tracking-tight mb-1">
          {label}
        </span>
        <span className="text-3xl font-extrabold">{value}</span>
      </div>
    );
  }

  function RecentDocsTable({ data }) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
        <h3 className="font-bold text-gray-800 text-lg mb-6 tracking-tight">
          Thống kê báo cáo
        </h3>
        <ul className="space-y-2">
          <li className="flex justify-between text-sm">
            <span>Tổng báo cáo:</span>{" "}
            <span className="font-bold">{data?.totalReports || 0}</span>
          </li>
          <li className="flex justify-between text-sm">
            <span>Đã duyệt:</span>{" "}
            <span className="font-bold text-green-600">
              {data?.approvedReports || 0}
            </span>
          </li>
          <li className="flex justify-between text-sm">
            <span>Chờ duyệt:</span>{" "}
            <span className="font-bold text-orange-500">
              {data?.pendingReports || 0}
            </span>
          </li>
          <li className="flex justify-between text-sm">
            <span>Từ chối:</span>{" "}
            <span className="font-bold text-red-500">
              {data?.rejectedReports || 0}
            </span>
          </li>
        </ul>
      </div>
    );
  }

  function ApprovalRequestsTable({ data }) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
        <h3 className="font-bold text-gray-800 text-lg mb-6 tracking-tight">
          Tài khoản hệ thống
        </h3>
        <ul className="space-y-2">
          <li className="flex justify-between text-sm">
            <span>Quản lý:</span>{" "}
            <span className="font-bold">{data?.totalManagers || 0}</span>
          </li>
          <li className="flex justify-between text-sm">
            <span>Nhân viên:</span>{" "}
            <span className="font-bold">{data?.totalEmployees || 0}</span>
          </li>
          <li className="flex justify-between text-sm">
            <span>Bị khóa:</span>{" "}
            <span className="font-bold text-red-500">
              {data?.lockedUsers || 0}
            </span>
          </li>
        </ul>
      </div>
    );
  }
};

// --- COMPONENTS CON ---
const NavItem = ({
  icon,
  label,
  active = false,
  onClick,
  disabled = false,
}) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
      disabled
        ? "cursor-not-allowed"
        : active
          ? "bg-white text-yellow-400 font-bold shadow-md"
          : "text-gray-800 hover:bg-black/10 hover:text-gray-900 cursor-pointer"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const RecentDocsTable = ({ data }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
    <h3 className="font-bold text-gray-800 text-lg mb-6 tracking-tight">
      Thống kê hệ thống
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-500">Tổng quản lý</p>
        <p className="text-2xl font-bold text-[#0f172a]">
          {data?.totalManagers || 0}
        </p>
      </div>
      <div className="p-4 bg-green-50 rounded-xl">
        <p className="text-sm text-gray-500">Tổng nhân viên</p>
        <p className="text-2xl font-bold text-[#0f172a]">
          {data?.totalEmployees || 0}
        </p>
      </div>
      <div className="p-4 bg-orange-50 rounded-xl">
        <p className="text-sm text-gray-500">Báo cáo chờ duyệt</p>
        <p className="text-2xl font-bold text-orange-600">
          {data?.pendingReports || 0}
        </p>
      </div>
      <div className="p-4 bg-red-50 rounded-xl">
        <p className="text-sm text-gray-500">Tài khoản bị khóa</p>
        <p className="text-2xl font-bold text-red-600">
          {data?.lockedUsers || 0}
        </p>
      </div>
    </div>
  </div>
);

const ApprovalRequestsTable = ({ data }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
    <h3 className="font-bold text-gray-800 text-lg mb-6 tracking-tight">
      Tổng quan báo cáo
    </h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <span className="text-gray-600 font-medium">Tổng số báo cáo</span>
        <span className="text-xl font-bold text-gray-800">
          {data?.totalReports || 0}
        </span>
      </div>
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
        <span className="text-green-700 font-medium">Đã phê duyệt</span>
        <span className="text-xl font-bold text-green-600">
          {data?.approvedReports || 0}
        </span>
      </div>
      <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
        <span className="text-red-700 font-medium">Bị từ chối</span>
        <span className="text-xl font-bold text-red-600">
          {data?.rejectedReports || 0}
        </span>
      </div>
    </div>
  </div>
);

const chartData = [
  { name: "Jan", value: 45 },
  { name: "Feb", value: 52 },
  { name: "Mar", value: 48 },
  { name: "Apr", value: 62 },
  { name: "May", value: 55 },
  { name: "Jun", value: 68 },
  { name: "Jul", value: 58 },
  { name: "Aug", value: 65 },
  { name: "Sep", value: 71 },
  { name: "Oct", value: 66 },
  { name: "Nov", value: 73 },
  { name: "Dec", value: 80 },
];

export default Dashboard;
