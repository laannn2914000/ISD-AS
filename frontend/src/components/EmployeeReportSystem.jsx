import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  History,
  User,
  LogOut,
  Search,
  Bell,
  Loader2,
  Eye,
  RefreshCcw,
} from "lucide-react";

const EmployeeReportSystem = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Người dùng",
    role: "employee",
  };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/reports/my-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error("Lỗi tải báo cáo:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans relative">
      {/* SIDEBAR TRẮNG ĐỒNG NHẤT */}
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
          <NavItem
            icon={<FileText size={20} />}
            label="Báo cáo của tôi"
            active={location.pathname === "/employee-reports"}
            onClick={() => navigate("/employee-reports")}
          />
          {/* Tách riêng chức năng Tạo báo cáo - Sẽ làm sau */}
          <NavItem
            icon={<FilePlus size={20} />}
            label="Tạo báo cáo"
            onClick={() => navigate("/employee-create-report")}
          />
          <NavItem icon={<History size={20} />} label="Lịch sử báo cáo" />
          <NavItem icon={<User size={20} />} label="Thông tin cá nhân" />
        </nav>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all mt-auto font-semibold"
        >
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo đã gửi..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10 text-left">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-400 font-semibold tracking-tight uppercase">
                  Nhân viên
                </p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8 text-left">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Báo cáo của tôi
              </h2>
              <p className="text-gray-400 text-sm mt-1.5">
                Trạng thái phê duyệt các chứng từ và báo cáo của bạn
              </p>
            </div>
            <button
              onClick={fetchMyReports}
              className="p-3 text-[#0061f2] hover:bg-blue-50 rounded-2xl transition-all"
            >
              <RefreshCcw size={24} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="p-6">Mã Số</th>
                  <th className="p-6">Tiêu đề báo cáo</th>
                  <th className="p-6">Ngày gửi</th>
                  <th className="p-6">Trạng thái</th>
                  <th className="p-6 text-center">Xem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-blue-500"
                        size={32}
                      />
                    </td>
                  </tr>
                ) : reports.length > 0 ? (
                  reports.map((report) => (
                    <tr
                      key={report._id}
                      className="text-sm hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-6 font-bold text-gray-700">
                        {report.reportId || "---"}
                      </td>
                      <td className="p-6 text-gray-600 font-medium">
                        {report.name}
                      </td>
                      <td className="p-6 text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase ${
                            report.status === "Approved"
                              ? "bg-green-50 text-green-600"
                              : report.status === "Rejected"
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {report.status === "Submitted"
                            ? "Chờ duyệt"
                            : report.status === "Approved"
                              ? "Đã duyệt"
                              : "Từ chối"}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-20 text-center text-gray-400">
                      Không tìm thấy dữ liệu báo cáo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800">Xác nhận</h3>
            <p className="text-gray-500 text-sm mt-2">
              Bạn muốn đăng xuất khỏi hệ thống?
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3.5 font-bold text-gray-400 bg-gray-50 rounded-2xl"
              >
                Hủy
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3.5 font-bold text-white bg-red-500 rounded-2xl"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${active ? "bg-blue-50 text-[#0061f2] font-bold shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

export default EmployeeReportSystem;
