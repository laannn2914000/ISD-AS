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
} from "lucide-react";
import ReportDetailModal from "../components/ReportDetailModal";

const ReportSystem = () => {
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
    fullName: "Admin",
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
      // Lọc bỏ báo cáo tài chính - chỉ hiển thị báo cáo hàng ngày và kinh doanh
      const res = await axios.get(`${API_URL}/api/reports/search`, {
        params: {
          name: searchTerm,
          status: statusFilter === "All" ? "" : statusFilter,
          // Không lọc theo type để lấy tất cả, sẽ lọc client-side
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      // Lọc client-side: bỏ báo cáo tài chính
      const filtered = res.data.filter((r) => r.type !== "finance");
      setReports(filtered);
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
      alert("Lỗi xử lý");
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
              placeholder="Tìm kiếm báo cáo..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchReports()}
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
                  {user.role}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-yellow-500 font-bold text-lg">
                A
              </div>
            </div>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH (PHÊ DUYỆT BÁO CÁO) */}
        <main className="p-10 space-y-8 text-left">
          <section>
            <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Phê duyệt báo cáo
            </h2>
            <p className="text-gray-400 text-sm mt-1.5 font-normal">
              Quản lý và kiểm duyệt các báo cáo từ nhân viên
            </p>
          </section>

          {/* BẢNG DỮ LIỆU BÁO CÁO */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Filter Bar bên trong Main */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <select
                className="bg-white border border-gray-100 p-2.5 rounded-xl text-sm font-bold outline-none shadow-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Submitted">Chờ duyệt</option>
                <option value="Approved">Đã duyệt</option>
                <option value="Rejected">Từ chối</option>
              </select>
              <button
                onClick={fetchReports}
                className="bg-gray-900 text-yellow-400 px-6 py-2.5 rounded-xl font-bold text-sm"
              >
                Lọc dữ liệu
              </button>
            </div>

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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-yellow-500"
                        size={32}
                      />
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* MODALS (Logout & Approve/Reject) */}
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      )}

      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 text-center">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200 text-left">
            <h3 className="text-xl font-bold text-gray-800">
              {showConfirmModal.type === "Approve"
                ? "Xác nhận duyệt báo cáo"
                : "Từ chối báo cáo"}
            </h3>
            {showConfirmModal.type === "Reject" && (
              <textarea
                className="w-full mt-4 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-1 focus:ring-red-500 text-sm"
                placeholder="Nhập lý do từ chối..."
                rows="3"
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
              />
            )}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() =>
                  setShowConfirmModal({ show: false, type: "", id: "" })
                }
                className="flex-1 py-3.5 font-bold text-gray-500 bg-gray-50 rounded-2xl"
              >
                Hủy
              </button>
              <button
                onClick={handleAction}
                className={`flex-1 py-3.5 font-bold text-white rounded-2xl ${showConfirmModal.type === "Approve" ? "bg-green-500" : "bg-red-500"}`}
              >
                {showConfirmModal.type === "Approve" ? "Duyệt" : "Từ chối"}
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

// --- COMPONENTS HỖ TRỢ (GIỮ ĐÚNG THIẾT KẾ CŨ) ---
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

const LogoutModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <LogOut size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-800">Xác nhận đăng xuất</h3>
      <p className="text-gray-500 text-sm mt-2">
        Bạn có chắc chắn muốn rời khỏi hệ thống?
      </p>
      <div className="flex gap-3 mt-8">
        <button
          onClick={onCancel}
          className="flex-1 py-3.5 font-bold text-gray-500 bg-gray-50 rounded-2xl"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3.5 font-bold text-white bg-red-500 rounded-2xl"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
);

export default ReportSystem;
