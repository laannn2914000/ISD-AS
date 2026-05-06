import React, { useState, useEffect, useCallback } from "react";
import ReportDetailModal from "./ReportDetailModal";
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
  Edit,
  Trash2,
  XCircle,
} from "lucide-react";

const EmployeeReportSystem = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Người dùng",
    role: "employee",
  };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const isReportCode = (value) => /^BC-\d+$/i.test(value.trim());

  const fetchMyReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/reports/my-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setReports(data || []);
      setTotalPages(1);
      setPage(1);
    } catch (error) {
      console.error("Lỗi lấy Quản lý báo cáo:", error);
      setReports([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    const timer = setTimeout(fetchMyReports, 300);
    return () => clearTimeout(timer);
  }, [fetchMyReports]);

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const visibleReports = reports.filter((report) => {
    const searchValue = searchTerm.trim().toLowerCase();
    const matchesSearch = searchValue
      ? report.name?.toLowerCase().includes(searchValue) ||
        report.reportId?.toLowerCase().includes(searchValue) ||
        report.creatorName?.toLowerCase().includes(searchValue)
      : true;
    const matchesStatus =
      statusFilter === "All" ? true : report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            label="Quản lý báo cáo"
            active={location.pathname === "/employee-reports"}
            onClick={() => navigate("/employee-reports")}
          />
          {/* Tách riêng chức năng Tạo báo cáo - Sẽ làm sau */}
          <NavItem
            icon={<FilePlus size={20} />}
            label="Tạo báo cáo"
            onClick={() => navigate("/employee-create-report")}
          />
          <NavItem
            icon={<User size={20} />}
            label="Thông tin cá nhân"
            active={location.pathname === "/employee-profile"}
            onClick={() => navigate("/employee-profile")}
          />
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
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
                Quản lý báo cáo
              </h2>
            </div>
            <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
              {["All", "Draft", "Submitted", "Approved", "Rejected"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setPage(1);
                    }}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === s
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {s === "All"
                      ? "Tất cả"
                      : s === "Draft"
                        ? "Nháp"
                        : s === "Submitted"
                          ? "Chờ duyệt"
                          : s === "Approved"
                            ? "Đã duyệt"
                            : "Từ chối"}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="p-6">Mã Số</th>
                  <th className="p-6">Tiêu đề báo cáo</th>
                  <th className="p-6">Ngày gửi</th>
                  <th className="p-6">Trạng thái</th>
                  <th className="p-6 text-center">Hành động</th>
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
                ) : visibleReports.length > 0 ? (
                  visibleReports.map((report) => (
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
                                : report.status === "Draft"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {report.status === "Draft"
                            ? "Nháp"
                            : report.status === "Submitted"
                              ? "Chờ duyệt"
                              : report.status === "Approved"
                                ? "Đã duyệt"
                                : "Từ chối"}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye size={18} />
                          </button>
                          <div className="flex items-center gap-2">
                            {(report.status === "Draft" ||
                              report.status === "Rejected") && (
                              <button
                                className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                onClick={() =>
                                  navigate(
                                    `/employee-edit-report/${report._id}`,
                                  )
                                }
                                title="Chỉnh sửa báo cáo"
                              >
                                <Edit size={18} />
                              </button>
                            )}
                            {report.status !== "Approved" && (
                              <button
                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                onClick={async () => {
                                  if (
                                    !window.confirm(
                                      "Bạn có chắc chắn muốn xóa báo cáo này?",
                                    )
                                  )
                                    return;
                                  try {
                                    await axios.delete(
                                      `${API_URL}/api/reports/${report._id}`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      },
                                    );
                                    fetchMyReports();
                                  } catch (err) {
                                    alert(
                                      "Không thể xóa báo cáo: " +
                                        (err.response?.data?.message ||
                                          "Lỗi kết nối"),
                                    );
                                  }
                                }}
                                title="Xóa báo cáo"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                          </div>
                        </div>
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

          {visibleReports.length > 0 && (
            <div className="mt-6 flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 rounded-b-3xl">
              <p className="text-sm text-gray-500">
                Trang {page} trên {totalPages} - {visibleReports.length} báo cáo
                hiển thị
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                  >
                    ←
                  </button>
                  {/* Hiển thị các nút số trang */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 5) return true;
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - page) <= 1) return true;
                      return false;
                    })
                    .map((p, idx, arr) => (
                      <div key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            page === p
                              ? "bg-blue-500 text-white"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                  >
                    →
                  </button>
                </div>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={page}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= totalPages) setPage(val);
                  }}
                  className="w-12 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Trang"
                />
              </div>
            </div>
          )}
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
      {/* MODAL XEM CHI TIẾT BÁO CÁO */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

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
          ? "bg-blue-50 text-[#0061f2] font-bold shadow-sm"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

export default EmployeeReportSystem;
