import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  History,
  User,
  LogOut,
  Search,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Loader2,
  Plus,
  Users,
  BarChart3,
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

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user từ localStorage sau khi đăng nhập thành công
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "User",
    role: "nhân viên",
    email: "",
  };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Gọi API lấy dữ liệu thống kê của nhân viên
        const res = await axios.get(
          `${API_URL}/api/employee-stats/${user.email}`,
        );
        setData(res.data);
      } catch (err) {
        console.error("Lỗi kết nối:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [user.email, API_URL]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-4 text-center">
        <Loader2 className="animate-spin text-[#0061f2] mb-4" size={40} />
        <p className="text-gray-500 font-medium">Đang tải dữ liệu cá nhân...</p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-gray-100 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#0061f2] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            G
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">GoFinance</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Nhân viên Portal
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
          />
          <NavItem icon={<FileText size={20} />} label="Báo cáo của tôi" />
          <NavItem icon={<FilePlus size={20} />} label="Tạo báo cáo" />
          <NavItem icon={<History size={20} />} label="Lịch sử báo cáo" />
          <NavItem icon={<User size={20} />} label="Thông tin cá nhân" />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all mt-auto font-semibold active:scale-95"
        >
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">
        {/* --- HEADER (Hàng trên cùng) --- */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
          {/* 1. Thanh Search dài ở phía bên trái */}
          <div className="relative flex-1 max-w-2xl">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm chứng từ hoặc báo cáo..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2] text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* 2. Cụm Icon và Profile ở bên phải */}
          <div className="flex items-center gap-6 ml-auto">
            <div className="relative p-2 text-gray-400 hover:text-[#0061f2] hover:bg-blue-50 rounded-full cursor-pointer transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>

            {/* Component Profile: Định dạng đúng như ảnh */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                {/* Thay tên bằng User */}
                <p className="text-base font-bold text-gray-800 leading-tight">
                  User
                </p>
                <p className="text-xs text-gray-400 font-semibold tracking-tight uppercase">
                  {user.role}
                </p>
              </div>
              {/* Icon VK: Thay thế bằng ảnh đại diện hoặc chữ cái đầu */}
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                {user.fullName.split(" ").pop().charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="p-10 space-y-8">
          {/* --- HÀNG TỰA ĐỀ VÀ NÚT TẠO (Phía trên cùng của Main) --- */}
          <div className="flex justify-between items-start">
            {/* 1. Tiêu đề: Nằm phía trái trên box tổng báo cáo */}
            <section>
              <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Dashboard
              </h2>
              <p className="text-gray-400 text-sm mt-1.5 font-normal">
                Tổng quan hoạt động báo cáo cá nhân
              </p>
            </section>

            {/* 2. Box Tạo báo cáo: Nằm phía phải trên box công nợ */}
            <button className="flex items-center gap-2.5 px-6 py-3.5 bg-[#0061f2] text-white rounded-2xl font-bold text-base hover:bg-[#0052cc] transition-all shadow-lg active:scale-95">
              <Plus size={20} strokeWidth={3} />
              Tạo báo cáo mới
            </button>
          </div>

          {/* STAT CARDS - Thẻ thông số tập trung vào nhân viên */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FileSearch className="text-[#0061f2]" />}
              bg="bg-blue-50"
              label="Tổng báo cáo đã tạo"
              value={data?.stats.totalMyDocs || 0}
              sub="Tất cả thời gian"
            />
            <StatCard
              icon={<CheckCircle2 className="text-green-600" />}
              bg="bg-green-50"
              label="Đã được phê duyệt"
              value={data?.stats.approvedDocs || 0}
              sub="Quy trình hoàn tất"
              trend="+5%"
            />
            <StatCard
              icon={<Clock className="text-orange-500" />}
              bg="bg-orange-50"
              label="Đang chờ xử lý"
              value={data?.stats.pendingDocs || 0}
              sub="Chờ quản lý xem xét"
              trend="+2"
              trendColor="text-orange-500"
            />
            <StatCard
              icon={<AlertCircle className="text-red-500" />}
              bg="bg-red-50"
              label="Bị từ chối"
              value={data?.stats.rejectedDocs || 0}
              sub="Cần kiểm tra lại"
              trend="-1"
              trendColor="text-red-500"
            />
          </div>

          {/* BIỂU ĐỒ HOẠT ĐỘNG */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg">
                  Hoạt động báo cáo gần đây
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Xem theo:</span>
                  <select className="text-sm font-semibold border-none bg-gray-50 rounded-lg px-3 py-1.5 outline-none text-[#0061f2]">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                  </select>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={personalPerformanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="day"
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
                        padding: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="reports"
                      stroke="#0061f2"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: "#0061f2",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BÁO CÁO GẦN ĐÂY NHẤT */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="font-bold text-gray-800 text-lg mb-6">
                Báo cáo gần đây
              </h3>
              <div className="space-y-5">
                {data?.recentReports.length > 0 ? (
                  data.recentReports.map((report, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-[#0061f2]">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {report.docId || "Báo cáo chi phí"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {report.date || "Vừa xong"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight ${getStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                    <AlertCircle
                      className="text-gray-400 mx-auto mb-3"
                      size={32}
                    />
                    <p className="text-sm text-gray-400 font-medium">
                      Bạn chưa tạo báo cáo nào trong hệ thống.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- COMPONENTS ---
const NavItem = ({ icon, label, active = false }) => (
  <div
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${active ? "bg-blue-50 text-[#0061f2] font-bold shadow-sm" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const StatCard = ({ icon, bg, label, value, sub, trend, trendColor = "text-green-600" }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-tight">{label}</p>
        <p className="text-3xl font-extrabold text-[#0f172a]">{value}</p>
      </div>
      {/* Kiểm tra icon trước khi render để tránh lỗi undefined */}
      <div className={`${bg} w-12 h-12 rounded-2xl flex items-center justify-center`}>
        {icon ? icon : <div className="w-5 h-5 bg-gray-200 animate-pulse" />}
      </div>
    </div>
    <div className="flex justify-between items-center mt-3">
        <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
        {trend && (
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 ${trendColor} bg-opacity-10 rounded-full`}>
                {/* Sử dụng check an toàn cho icon trend */}
                {trend.startsWith('+') ? <TrendingUp size={14}/> : <Clock size={14}/>} 
                {trend}
            </div>
        )}
    </div>
  </div>
);

const getStatusColor = (s) => {
  if (s === "Đã duyệt") return "bg-green-50 text-green-600";
  if (s === "Từ chối") return "bg-red-50 text-red-600";
  return "bg-orange-50 text-orange-600";
};

// Dữ liệu giả định hiệu suất tuần
const personalPerformanceData = [
  { day: "T2", reports: 2 },
  { day: "T3", reports: 5 },
  { day: "T4", reports: 3 },
  { day: "T5", reports: 8 },
  { day: "T6", reports: 6 },
  { day: "T7", reports: 1 },
  { day: "CN", reports: 0 },
];

export default EmployeeDashboard;
