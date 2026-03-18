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
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin từ localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Manager",
    role: "manager",
    email: "",
  };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        // Quản lý dùng chung API tổng quát để theo dõi hệ thống
        const res = await axios.get(`${API_URL}/api/dashboard-stats`);
        setData(res.data);
      } catch (err) {
        console.error("Lỗi kết nối API Quản lý:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, [API_URL]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#0061f2] mb-4" size={40} />
        <p className="text-gray-500 font-medium">
          Đang tải dữ liệu quản trị...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* SIDEBAR - Tích hợp điều hướng */}
      <aside className="w-[280px] bg-white border-r border-gray-100 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#0061f2] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            G
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">GoFinance</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold text-left">
              Quản lý Portal
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={
              location.pathname === "/manager-dashboard" ||
              location.pathname === "/dashboard"
            }
            onClick={() => navigate("/manager-dashboard")}
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
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all mt-auto font-semibold active:scale-95"
        >
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">
        {/* HEADER - Thiết kế tinh gọn */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo hệ thống..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2] text-sm"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">
                  User
                </p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">
                  {user.role}
                </p>
              </div>
              {/* Avatar hiển thị tên viết tắt */}
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                {user.fullName
                  ? user.fullName.split(" ").pop().charAt(0).toUpperCase()
                  : "M"}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8 text-left">
          <div className="flex justify-between items-start">
            <section>
              <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Dashboard
              </h2>
              <p className="text-gray-400 text-sm mt-1.5 font-normal">
                Tổng quan hoạt động báo cáo toàn hệ thống
              </p>
            </section>

            <button className="flex items-center gap-2.5 px-6 py-3.5 bg-[#0061f2] text-white rounded-2xl font-bold text-base hover:bg-[#0052cc] transition-all shadow-lg active:scale-95">
              <Plus size={20} strokeWidth={3} />
              Tạo báo cáo mới
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FileSearch className="text-[#0061f2]" />}
              bg="bg-blue-50"
              label="Tổng số chứng từ"
              value={data?.stats.totalDocs || "1,245"}
              sub="Dữ liệu toàn hệ thống"
            />
            <StatCard
              icon={<Clock className="text-orange-500" />}
              bg="bg-orange-50"
              label="Báo cáo chờ duyệt"
              value={data?.stats.pendingReports || "18"}
              sub="Yêu cầu cần xử lý"
            />
            <StatCard
              icon={<TrendingUp className="text-green-500" />}
              bg="bg-green-50"
              label="Công nợ phải thu"
              value={data?.stats.receivable || "485M"}
              sub="VND - Cập nhật hôm nay"
              trend="+12%"
            />
            <StatCard
              icon={<BarChart3 className="text-red-500" />}
              bg="bg-red-50"
              label="Công nợ phải trả"
              value={data?.stats.payable || "298M"}
              sub="VND - Cập nhật hôm nay"
              trend="-5%"
              trendColor="text-red-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FINANCIAL CHART */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-6">
                Financial Overview
              </h3>
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
                      stroke="#0061f2"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: "#0061f2",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT DOCUMENTS */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-6">
                Chứng từ mới cập nhật
              </h3>
              <div className="space-y-5">
                {(
                  data?.recentDocuments || [
                    {
                      docId: "DOC-1021",
                      department: "Accounting",
                      status: "Chờ duyệt",
                    },
                    {
                      docId: "DOC-1022",
                      department: "Sales",
                      status: "Đã duyệt",
                    },
                    { docId: "DOC-1023", department: "HR", status: "Từ chối" },
                  ]
                ).map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-xl text-[#0061f2]">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">
                          {doc.docId}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {doc.department}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${getStatusColor(doc.status)}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- COMPONENTS HỖ TRỢ ---
const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-blue-50 text-[#0061f2] font-bold shadow-sm"
        : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const StatCard = ({
  icon,
  bg,
  label,
  value,
  sub,
  trend,
  trendColor = "text-green-600",
}) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-tight">
          {label}
        </p>
        <p className="text-3xl font-extrabold text-[#0f172a]">{value}</p>
      </div>
      <div
        className={`${bg} w-12 h-12 rounded-2xl flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
    <div className="flex justify-between items-center mt-3">
      <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
      {trend && (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full bg-opacity-10 ${trendColor.replace("text-", "bg-")} ${trendColor}`}
        >
          {trend}
        </span>
      )}
    </div>
  </div>
);

const getStatusColor = (s) => {
  if (s === "Đã duyệt") return "bg-green-50 text-green-600";
  if (s === "Từ chối") return "bg-red-50 text-red-600";
  return "bg-orange-50 text-orange-600";
};

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

export default ManagerDashboard;
