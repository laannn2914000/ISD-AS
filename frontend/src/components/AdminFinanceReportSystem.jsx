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
  CheckCircle,
  XCircle,
  Eye,
  FileSearch,
} from "lucide-react";
import ReportDetailModal from "./ReportDetailModal";

const AdminFinanceReportSystem = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState({
    show: false,
    type: "",
    id: "",
  });
  const [rejectComment, setRejectComment] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Người dùng",
    role: "admin",
  };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Chỉ lấy báo cáo tài chính (type = finance)
      const res = await axios.get(`${API_URL}/api/reports/search`, {
        params: {
          name: searchTerm,
          status: statusFilter === "All" ? "" : statusFilter,
          type: "finance", // Lọc theo loại báo cáo tài chính
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    const { type, id } = showConfirmModal;

    try {
      await axios.patch(
        `${API_URL}/api/reports/${id}/decide`,
        { action: type, comment: rejectComment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowConfirmModal({ show: false, type: "", id: "" });
      setRejectComment("");
      fetchReports();
    } catch (err) {
      alert("Lỗi xử lý: " + (err.response?.data?.message || "Lỗi kết nối"));
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-left relative">
      {/* SIDEBAR (GIỮ NGUYÊN THIẾT KẾ DASHBOARD) */}
      <aside className="w-[280px] bg-yellow-400 border-r border-yellow-500/20 p-6 flex flex-col">
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

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {/* HEADER (GIỮ NGUYÊN THIẾT KẾ DASHBOARD) */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo tài chính..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchReports()}
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">
                  Người dùng
                </p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">
                  Quản trị viên
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Báo cáo tài chính
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Quản lý và phê duyệt báo cáo tài chính từ nhân viên
              </p>
            </div>
            <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
              {["All", "Submitted", "Approved", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === s
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {s === "All"
                    ? "Tất cả"
                    : s === "Submitted"
                      ? "Đợi duyệt"
                      : s === "Approved"
                        ? "Đã duyệt"
                        : "Đã từ chối"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-[32px] border border-dashed border-gray-200">
              <Loader2
                className="animate-spin text-yellow-500 mb-4"
                size={40}
              />
              <p className="text-gray-400 font-medium">Đang tải danh sách...</p>
            </div>
          ) : reports.length > 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    <th className="p-6">Mã BC</th>
                    <th className="p-6">Tên báo cáo</th>
                    <th className="p-6">Người tạo</th>
                    <th className="p-6">Trạng thái</th>
                    <th className="p-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reports.map((report) => (
                    <tr
                      key={report._id}
                      className="text-sm hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-6 font-bold text-gray-700">
                        {report.reportId}
                      </td>
                      <td className="p-6 text-gray-600 font-medium">
                        {report.name}
                      </td>
                      <td className="p-6 text-gray-500">
                        {report.creatorName}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase ${
                            report.status === "Approved" ||
                            report.status === "approved"
                              ? "bg-green-50 text-green-600"
                              : report.status === "Rejected" ||
                                  report.status === "rejected"
                                ? "bg-red-50 text-red-600"
                                : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {report.status === "Approved" ||
                          report.status === "approved"
                            ? "Đã duyệt"
                            : report.status === "Rejected" ||
                                report.status === "rejected"
                              ? "Từ chối"
                              : "Chờ duyệt"}
                        </span>
                      </td>
                      <td className="p-6 flex justify-center gap-3">
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye size={18} />
                        </button>
                        {report.status === "Submitted" && (
                          <>
                            <button
                              onClick={() =>
                                setShowConfirmModal({
                                  show: true,
                                  type: "Approve",
                                  id: report._id,
                                })
                              }
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() =>
                                setShowConfirmModal({
                                  show: true,
                                  type: "Reject",
                                  id: report._id,
                                })
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
              <FileSearch size={64} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">
                Hiện không có báo cáo tài chính nào cần xử lý
              </p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL PHÊ DUYỆT / TỪ CHỐI */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {showConfirmModal.type === "Approve"
                ? "Xác nhận duyệt báo cáo"
                : "Từ chối báo cáo"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Hành động này sẽ cập nhật trạng thái báo cáo chính thức trên hệ
              thống.
            </p>

            {showConfirmModal.type === "Reject" && (
              <textarea
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-500 mb-6"
                placeholder="Lý do từ chối để nhân viên sửa đổi..."
                rows="3"
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal({ show: false, type: "", id: "" });
                  setRejectComment("");
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleAction}
                className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all ${
                  showConfirmModal.type === "Approve"
                    ? "bg-green-600 shadow-green-100 hover:bg-green-700"
                    : "bg-red-600 shadow-red-100 hover:bg-red-700"
                }`}
              >
                {showConfirmModal.type === "Approve" ? "Duyệt" : "Từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[32px] text-center shadow-2xl max-w-sm w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogOut size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Đăng xuất?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Bạn có chắc chắn muốn rời khỏi phiên làm việc này?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT BÁO CÁO */}
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
          ? "bg-white text-yellow-400 font-bold shadow-md"
          : "text-gray-800 hover:bg-black/10 hover:text-gray-900 cursor-pointer"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

export default AdminFinanceReportSystem;
