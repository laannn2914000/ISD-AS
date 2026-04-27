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
import { useNavigate, useLocation } from "react-router-dom";

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Thêm state quản lý modal
  const navigate = useNavigate(); // Thêm dòng này
  const location = useLocation(); // Thêm dòng này để xử lý trạng thái active

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

  // Hàm xử lý đăng xuất thực tế
  const confirmLogout = () => {
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
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans relative">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-gray-100 p-6 flex flex-col text-left">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#0061f2] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            G
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">KTBM</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Nhân viên
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={location.pathname === "/employee-dashboard"}
            onClick={() => navigate("/employee-dashboard")}
          />

          {/* Chuyển hướng đến danh sách báo cáo */}
          <NavItem
            icon={<FileText size={20} />}
            label="Báo cáo của tôi"
            active={location.pathname === "/employee-reports"}
            onClick={() => navigate("/employee-reports")}
          />

          <NavItem
            icon={<FilePlus size={20} />}
            label="Tạo báo cáo"
            active={location.pathname === "/employee-create-report"}
            onClick={() => navigate("/employee-create-report")}
          />
          <NavItem
            icon={<User size={20} />}
            label="Thông tin cá nhân"
            active={location.pathname === "/employee-profile"}
            onClick={() => navigate("/employee-profile")}
          />
        </nav>

        {/* Nút đăng xuất mở Pop-up */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all mt-auto font-semibold active:scale-95"
        >
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">
        {/* HEADER */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
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

          <div className="flex items-center gap-6 ml-auto">
            <div className="relative p-2 text-gray-400 hover:text-[#0061f2] hover:bg-blue-50 rounded-full cursor-pointer transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10 text-left">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">
                  Người dùng
                </p>
                <p className="text-xs text-gray-400 font-semibold tracking-tight uppercase">
                  {user.role}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                {user.fullName.split(" ").pop().charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="p-10 space-y-8 text-left">
          <div className="flex justify-between items-start">
            <section>
              <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Dashboard
              </h2>
              <p className="text-gray-400 text-sm mt-1.5 font-normal">
                Tổng quan hoạt động báo cáo cá nhân
              </p>
            </section>

            <button
              onClick={() => navigate("/employee-create-report")}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-[#0061f2] text-white rounded-2xl font-bold text-base hover:bg-[#0052cc] transition-all shadow-lg active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
              Tạo báo cáo mới
            </button>
          </div>

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
                    data={[
                      { day: "Tổng", reports: data?.stats?.totalMyDocs || 0 },
                      {
                        day: "Đã duyệt",
                        reports: data?.stats?.approvedDocs || 0,
                      },
                      {
                        day: "Chờ duyệt",
                        reports: data?.stats?.pendingDocs || 0,
                      },
                      {
                        day: "Từ chối",
                        reports: data?.stats?.rejectedDocs || 0,
                      },
                      { day: "Nháp", reports: data?.stats?.draftDocs || 0 },
                    ]}
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

      {/* POP-UP XÁC NHẬN ĐĂNG XUẤT */}
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
};

// --- COMPONENTS ---
const NavItem = ({
  icon,
  label,
  active = false,
  onClick,
  disabled = false,
}) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all active:scale-[0.98] ${
      disabled
        ? "cursor-not-allowed"
        : active
          ? "bg-blue-50 text-[#0061f2] font-bold shadow-sm"
          : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 cursor-pointer"
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
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
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
        {icon ? icon : <div className="w-5 h-5 bg-gray-200 animate-pulse" />}
      </div>
    </div>
    <div className="flex justify-between items-center mt-3">
      <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
      {trend && (
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 ${trendColor} bg-opacity-10 rounded-full`}
        >
          {trend.startsWith("+") ? (
            <TrendingUp size={14} />
          ) : (
            <Clock size={14} />
          )}
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
