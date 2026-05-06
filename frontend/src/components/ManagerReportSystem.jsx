import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  BarChart3,
  FileSearch,
  Settings,
  LogOut,
  Search,
  Bell,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Plus,
  ArrowLeft,
  Save,
  Send,
  Edit,
} from "lucide-react";
import ReportDetailModal from "./ReportDetailModal";

const ManagerReportSystem = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Người quản lý",
    dept: "Phòng Kế toán",
  };
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "CÔNG TY CỔ PHẦN KẾ TOÁN BÁCH MỸ",
    reportNumber: "......./BC-AX",
    location: "Hà Nội",
    recipient: "Ban Giám đốc Công ty Cổ phần Kế toán Bách Mỹ",
    reporter: user.fullName,
    dept: user.dept || "Phòng Kế toán",
    title: "",
    income: 0,
    expense: 0,
    detail: "",
    done: "",
    issues: "",
    plan: "",
    kpi: 0,
    analysis: "",
  });
  const reportRef = useRef();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const isReportCode = (value) => /^BC-\d+$/i.test(value.trim());

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const trimmed = searchTerm.trim();
      const reportId = isReportCode(trimmed) ? trimmed : "";
      const res = await axios.get(`${API_URL}/api/reports/search`, {
        params: {
          ...(reportId ? { reportId } : { search: trimmed }),
          status: statusFilter === "All" ? "" : statusFilter,
          page,
          limit: 10,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setReports(data.reports || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || page);
    } catch (error) {
      console.error("Lỗi tìm kiếm báo cáo:", error);
      setReports([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [API_URL, searchTerm, statusFilter, token, page]);

  useEffect(() => {
    const timer = setTimeout(fetchReports, 300);
    return () => clearTimeout(timer);
  }, [fetchReports]);

  const handleAction = async () => {
    const { type, id } = showConfirmModal;

    try {
      if (type === "Delete") {
        await axios.delete(`${API_URL}/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.patch(
          `${API_URL}/api/reports/${id}/decide`,
          { action: type, comment: rejectComment },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
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

  const handleSubmitReport = async (status = "Submitted") => {
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề báo cáo.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/reports/create`,
        {
          name: formData.title,
          type: template || "finance",
          content: formData,
          status,
          dept: formData.dept,
          creatorName: formData.reporter,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShowCreateModal(false);
      setStep(1);
      setTemplate(null);
      setFormData({
        ...formData,
        title: "",
        income: 0,
        expense: 0,
        detail: "",
        done: "",
        issues: "",
        plan: "",
        kpi: 0,
        analysis: "",
      });
      fetchReports();
    } catch (err) {
      alert(
        "Lỗi khi tạo báo cáo: " +
          (err.response?.data?.message || "Lỗi kết nối"),
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* SIDEBAR - GIỮ NGUYÊN BẢN GIAO DIỆN MÀU XANH CỦA BẠN */}
      <aside className="w-[280px] bg-[#0061f2] border-r border-white/10 p-6 flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0061f2] font-bold text-xl shadow-lg">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">KTBM</h1>
            <p className="text-[10px] text-white uppercase tracking-widest font-semibold">
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
          <NavItem
            icon={<FileCheck size={20} />}
            label="Quản lý báo cáo"
            active={location.pathname === "/manager-reports"}
            onClick={() => navigate("/manager-reports")}
          />
          <NavItem icon={<Settings size={20} />} label="Cài đặt" disabled />
        </nav>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 text-white p-4 hover:bg-white/10 rounded-xl transition-all mt-auto font-bold"
        >
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo..."
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
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">
                  Người dùng
                </p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">
                  Quản lý
                </p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                M
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Quản lý báo cáo{" "}
              </h2>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setStep(1);
                  setTemplate(null);
                  setFormData({
                    companyName: "CÔNG TY CỔ PHẦN KẾ TOÁN BÁCH MỸ",
                    reportNumber: "......./BC-AX",
                    location: "Hà Nội",
                    recipient: "Ban Giám đốc Công ty Cổ phần Kế toán Bách Mỹ",
                    reporter: user.fullName,
                    dept: user.dept || "Phòng Kế toán",
                    title: "",
                    income: 0,
                    expense: 0,
                    detail: "",
                    done: "",
                    issues: "",
                    plan: "",
                    kpi: 0,
                    analysis: "",
                  });
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0061f2] text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                <Plus size={18} /> Tạo báo cáo
              </button>
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
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-[32px] border border-dashed border-gray-200">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
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
                                : report.status === "Draft" ||
                                    report.status === "draft"
                                  ? "bg-gray-50 text-gray-600"
                                  : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {report.status === "Approved" ||
                          report.status === "approved"
                            ? "Đã duyệt"
                            : report.status === "Rejected" ||
                                report.status === "rejected"
                              ? "Từ chối"
                              : report.status === "Draft" ||
                                  report.status === "draft"
                                ? "Nháp"
                                : "Chờ duyệt"}
                        </span>
                      </td>
                      <td className="p-6 flex justify-center gap-3">
                        <button
                          className="p-2 text-gray-500 hover:bg-blue-50 rounded-lg"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye size={18} />
                        </button>
                        {report.creatorName === user.fullName
                          ? report.status !== "Approved" &&
                            report.status !== "approved" && (
                              <>
                                {(report.status === "Draft" ||
                                  report.status === "draft" ||
                                  report.status === "Rejected" ||
                                  report.status === "rejected") && (
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/manager-edit-report/${report._id}`,
                                      )
                                    }
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                  >
                                    <Edit size={18} />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    setShowConfirmModal({
                                      show: true,
                                      type: "Delete",
                                      id: report._id,
                                    })
                                  }
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )
                          : report.status === "Submitted" && (
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
                Hiện không có báo cáo nào cần xử lý
              </p>
            </div>
          )}

          {reports.length > 0 && (
            <div className="mt-6 flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 rounded-b-3xl">
              <p className="text-sm text-gray-500">
                Trang {page} trên {totalPages} - {reports.length} báo cáo hiển
                thị
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
                              ? "bg-blue-600 text-white"
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
                  className="w-12 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:ring-1 focus:ring-blue-600 outline-none"
                  placeholder="Trang"
                />
              </div>
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
                : showConfirmModal.type === "Reject"
                  ? "Từ chối báo cáo"
                  : "Xóa báo cáo"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {showConfirmModal.type === "Delete"
                ? "Hành động này sẽ xóa báo cáo khỏi hệ thống. Bạn có chắc chắn?"
                : "Hành động này sẽ cập nhật trạng thái báo cáo chính thức trên hệ thống."}
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
                className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all ${showConfirmModal.type === "Approve" ? "bg-green-600 shadow-green-100 hover:bg-green-700" : "bg-red-600 shadow-red-100 hover:bg-red-700"}`}
              >
                {showConfirmModal.type === "Approve" ? "Duyệt" : "Từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-[32px] p-8 shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Tạo báo cáo mới
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setStep(1);
                  setTemplate(null);
                }}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                Đóng
              </button>
            </div>

            <div className="flex flex-col xl:flex-row gap-10">
              <div className="xl:w-1/2">
                <div className="flex items-center gap-3 mb-6">
                  {step === 2 && (
                    <button
                      onClick={() => setStep(1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {step === 1
                        ? "Chọn mẫu báo cáo"
                        : "Nhập nội dung báo cáo"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {step === 1
                        ? ""
                        : "Hoàn thiện nội dung và gửi phê duyệt."}
                    </p>
                  </div>
                </div>

                {step === 1 ? (
                  <div className="grid gap-4">
                    {[
                      {
                        id: "finance",
                        name: "Báo cáo tài chính",
                        desc: "Thu/chi, doanh thu và dòng tiền",
                      },
                      {
                        id: "daily",
                        name: "Báo cáo hàng ngày",
                        desc: "Công việc và kế hoạch ngày tiếp theo",
                      },
                      {
                        id: "business",
                        name: "Báo cáo kinh doanh",
                        desc: "Doanh số, KPI và phân tích",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTemplate(item.id);
                          setFormData({
                            ...formData,
                            title: item.name.toUpperCase(),
                          });
                          setStep(2);
                        }}
                        className={`rounded-3xl p-6 border transition-all text-left ${
                          template === item.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="font-bold text-gray-900 mb-2">
                          {item.name}
                        </div>
                        <div className="text-gray-500">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3 pb-4 border-b border-gray-100">
                      <h4 className="text-[10px] font-bold text-blue-600 uppercase">
                        Thông tin chung
                      </h4>
                      <input
                        type="text"
                        placeholder="Tên công ty"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Số hiệu"
                          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                          value={formData.reportNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reportNumber: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Địa danh"
                          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Kính gửi"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                        value={formData.recipient}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recipient: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-blue-600 uppercase">
                        Nội dung chi tiết
                      </h4>
                      <input
                        type="text"
                        placeholder="Tiêu đề báo cáo"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                      {template === "finance" && (
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            placeholder="Tổng thu"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                            value={formData.income || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                income: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            placeholder="Tổng chi"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                            value={formData.expense || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expense: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                      {template === "finance" && (
                        <textarea
                          rows="4"
                          placeholder="Chi tiết"
                          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                          value={formData.detail}
                          onChange={(e) =>
                            setFormData({ ...formData, detail: e.target.value })
                          }
                        />
                      )}
                      {template === "daily" && (
                        <>
                          <textarea
                            rows="3"
                            placeholder="Việc đã xong"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                            value={formData.done}
                            onChange={(e) =>
                              setFormData({ ...formData, done: e.target.value })
                            }
                          />
                          <textarea
                            rows="2"
                            placeholder="Khó khăn"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                            value={formData.issues}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                issues: e.target.value,
                              })
                            }
                          />
                          <textarea
                            rows="2"
                            placeholder="Kế hoạch mai"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                            value={formData.plan}
                            onChange={(e) =>
                              setFormData({ ...formData, plan: e.target.value })
                            }
                          />
                        </>
                      )}
                      {template === "business" && (
                        <>
                          <input
                            type="number"
                            placeholder="KPI (%)"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                            value={formData.kpi || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, kpi: e.target.value })
                            }
                          />
                          <textarea
                            rows="4"
                            placeholder="Phân tích"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-400"
                            value={formData.analysis}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                analysis: e.target.value,
                              })
                            }
                          />
                        </>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                      <button
                        onClick={() => handleSubmitReport("Draft")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-600 rounded-3xl font-bold hover:bg-gray-200"
                      >
                        <Save size={18} /> Lưu nháp
                      </button>
                      <button
                        onClick={() => handleSubmitReport("Submitted")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-3xl font-bold hover:bg-blue-700"
                      >
                        <Send size={18} /> Gửi phê duyệt
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="xl:w-1/2 bg-gray-100 rounded-[32px] p-6 overflow-y-auto max-h-[80vh]">
                <div
                  ref={reportRef}
                  className="bg-white p-8 rounded-[32px] min-h-[600px]"
                >
                  <div className="flex justify-between mb-8">
                    <div>
                      <p className="font-bold uppercase">
                        {formData.companyName}
                      </p>
                      <p className="text-sm">Số: {formData.reportNumber}</p>
                    </div>
                    <div className="text-right text-sm italic">
                      <p>
                        {formData.location}, ngày {new Date().getDate()} tháng{" "}
                        {new Date().getMonth() + 1} năm{" "}
                        {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold uppercase">
                      {formData.title || "TIÊU ĐỀ BÁO CÁO"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                      {template === "finance"
                        ? "Báo cáo tài chính"
                        : template === "daily"
                          ? "Báo cáo hàng ngày"
                          : template === "business"
                            ? "Báo cáo kinh doanh"
                            : "Loại báo cáo"}
                    </p>
                  </div>
                  <div className="space-y-4 text-sm">
                    <p>
                      <span className="font-bold">Kính gửi:</span>{" "}
                      {formData.recipient}
                    </p>
                    <p>
                      <span className="font-bold">Người báo cáo:</span>{" "}
                      {formData.reporter}
                    </p>
                    <p>
                      <span className="font-bold">Bộ phận:</span>{" "}
                      {formData.dept}
                    </p>
                    <div className="mt-4 border-l-4 border-gray-200 pl-4 space-y-3">
                      {template === "finance" && (
                        <>
                          <p>- Tổng thu: {formData.income || 0}</p>
                          <p>- Tổng chi: {formData.expense || 0}</p>
                          <p>- Chi tiết: {formData.detail || "..."}</p>
                        </>
                      )}
                      {template === "daily" && (
                        <>
                          <p>- Việc đã xong: {formData.done || "..."}</p>
                          <p>- Khó khăn: {formData.issues || "..."}</p>
                          <p>- Kế hoạch: {formData.plan || "..."}</p>
                        </>
                      )}
                      {template === "business" && (
                        <>
                          <p>- KPI: {formData.kpi || 0}%</p>
                          <p>- Phân tích: {formData.analysis || "..."}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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

// NavItem giữ đúng style màu trắng trên nền xanh của bạn
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
        ? "cursor-not-allowed text-white"
        : active
          ? "bg-white/20 text-white font-bold shadow-inner"
          : "text-white hover:bg-white/10 hover:text-white cursor-pointer"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

export default ManagerReportSystem;
