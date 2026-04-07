import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "./Sidebar";

// Hàm lấy theme color theo role
const getThemeByRole = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return {
        primary: "#fbbf24",
        primaryBg: "bg-yellow-400",
        primaryText: "text-yellow-400",
        primaryDark: "bg-yellow-500",
        primaryLight: "bg-yellow-50",
        primaryLightText: "text-yellow-700",
        searchRing: "focus:ring-yellow-300",
        button: "bg-yellow-400 hover:bg-yellow-500",
        buttonText: "text-gray-900",
        avatar: "bg-gray-900",
        avatarText: "text-yellow-400",
        icBoxBg: "bg-yellow-50",
        icBoxBorder: "border-yellow-100",
        icBoxText: "text-yellow-900",
      };
    case "manager":
    case "quản lý":
      return {
        primary: "#0061f2",
        primaryBg: "bg-blue-600",
        primaryText: "text-blue-600",
        primaryDark: "bg-blue-700",
        primaryLight: "bg-blue-50",
        primaryLightText: "text-blue-700",
        searchRing: "focus:ring-blue-300",
        button: "bg-blue-600 hover:bg-blue-700",
        buttonText: "text-white",
        avatar: "bg-white",
        avatarText: "text-blue-600",
        icBoxBg: "bg-blue-50",
        icBoxBorder: "border-blue-100",
        icBoxText: "text-blue-900",
      };
    default: // Employee
      return {
        primary: "#0061f2",
        primaryBg: "bg-white",
        primaryText: "text-blue-600",
        primaryDark: "bg-gray-50",
        primaryLight: "bg-blue-50",
        primaryLightText: "text-blue-700",
        searchRing: "focus:ring-blue-200",
        button: "bg-blue-600 hover:bg-blue-700",
        buttonText: "text-white",
        avatar: "bg-blue-600",
        avatarText: "text-white",
        icBoxBg: "bg-blue-50",
        icBoxBorder: "border-blue-100",
        icBoxText: "text-blue-900",
      };
  }
};

const ReportManagement = () => {
  console.log("=== REPORT MANAGEMENT COMPONENT RENDERED ===");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const location = useLocation();
  const isApprovalPage = location.pathname === "/approvals";
  const [reports, setReports] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Thanh toán",
    amount: 0,
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

  const theme = useMemo(() => getThemeByRole(user.role), [user.role]);
  const token = localStorage.getItem("token");
  const config = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token],
  );

  // Normalize role name để xử lý cả English và Vietnamese
  const normalizeRole = (role) => {
    if (!role) return "";
    const lower = role.toLowerCase().trim();
    if (lower === "quản lý") return "manager";
    if (lower === "nhân viên") return "employee";
    return lower;
  };

  const normalizedRole = normalizeRole(user.role);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/reports?keyword=${encodeURIComponent(keyword)}`,
        config,
      );
      setReports(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách báo cáo.",
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, keyword, config]);

  // Fetch reports khi component mount HOẶC khi location.pathname thay đổi (navigate)
  useEffect(() => {
    console.log(
      "ReportManagement: Fetching reports for pathname:",
      location.pathname,
    );
    fetchReports();
  }, [fetchReports, location.pathname]);

  const pageTitle = isApprovalPage
    ? "Phê duyệt báo cáo"
    : normalizedRole === "employee"
      ? "Báo cáo của tôi"
      : "Báo cáo tài chính";

  const pageSubtitle = isApprovalPage
    ? "Xem, đánh giá và phản hồi những báo cáo đang chờ duyệt."
    : normalizedRole === "employee"
      ? "Xem và quản lý các báo cáo bạn đã tạo."
      : "Quản lý tất cả báo cáo tài chính và theo dõi trạng thái xử lý.";

  console.log("ReportManagement render:", {
    pageTitle,
    isApprovalPage,
    normalizedRole,
  });

  const canModify = (report) => {
    if (!report) return false;
    return (
      ["manager", "admin"].includes(normalizedRole) ||
      report.author?._id === user.id
    );
  };

  const canReview = useMemo(
    () => ["manager", "admin"].includes(normalizedRole),
    [normalizedRole],
  );
  const canCreate = useMemo(
    () => ["employee", "manager", "admin"].includes(normalizedRole),
    [normalizedRole],
  );

  const reportSummary = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "Chờ duyệt").length;
    const approved = reports.filter((r) => r.status === "Đã duyệt").length;
    const rejected = reports.filter((r) => r.status === "Đã từ chối").length;
    return { total, pending, approved, rejected };
  }, [reports]);

  const visibleReports = useMemo(() => {
    let filtered = [...reports];

    // Employees chỉ nhìn thấy báo cáo của họ, managers xem tất cả
    if (normalizedRole === "employee" && !isApprovalPage) {
      filtered = filtered.filter((r) => r.author?._id === user.id);
    }

    if (isApprovalPage) {
      filtered.sort((a, b) => {
        const order = { "Chờ duyệt": 0, "Đã duyệt": 1, "Đã từ chối": 2 };
        return (order[a.status] || 3) - (order[b.status] || 3);
      });
    }
    return filtered;
  }, [reports, isApprovalPage, normalizedRole, user.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (!formData.title.trim() || !formData.content.trim()) {
        return setError("Tiêu đề và nội dung không được để trống.");
      }
      if (formData.amount < 0) {
        return setError("Số tiền phải lớn hơn hoặc bằng 0.");
      }

      if (formData._id) {
        await axios.put(
          `${API_URL}/api/reports/${formData._id}`,
          formData,
          config,
        );
      } else {
        await axios.post(`${API_URL}/api/reports`, formData, config);
      }
      setShowForm(false);
      setFormData({ title: "", type: "Thanh toán", amount: 0, content: "" });
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lưu báo cáo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa báo cáo này không?")) return;
    try {
      await axios.delete(`${API_URL}/api/reports/${id}`, config);
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa báo cáo.");
    }
  };

  const handleReview = async (id, status) => {
    const note = window.prompt(
      status === "Đã duyệt"
        ? "Nhập feedback/IC summary để duyệt:"
        : "Nhập lý do từ chối báo cáo:",
    );
    if (!note || !note.trim())
      return alert("Phải nhập phản hồi kiểm soát nội bộ.");

    try {
      await axios.patch(
        `${API_URL}/api/reports/approve/${id}`,
        { status, icSummary: note.trim() },
        config,
      );
      fetchReports();
      setSelectedReport((prev) =>
        prev?._id === id ? { ...prev, status, icSummary: note.trim() } : prev,
      );
    } catch (err) {
      alert(
        err.response?.data?.message || "Lỗi khi cập nhật trạng thái báo cáo.",
      );
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-left">
      {console.log("ReportManagement: Rendering Sidebar with user:", user)}
      <Sidebar user={user} setShowLogoutModal={setShowLogoutModal} />

      <div className="flex-1 overflow-y-auto">
        <header className="h-22 bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo..."
              className={`w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none ${theme.searchRing} focus:ring-1 text-sm`}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <div className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
              <Search size={22} />
            </div>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10 text-left">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">
                  {user.fullName || "Người dùng"}
                </p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">
                  {user.role || "Khách"}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${theme.avatar} rounded-full flex items-center justify-center ${theme.avatarText} font-bold text-lg shadow-md border-2 border-white`}
              >
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "G"}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8">
          <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-gray-500 mt-2">{pageSubtitle}</p>
            </div>
            {!isApprovalPage && canCreate && (
              <button
                onClick={() => {
                  setFormData({
                    title: "",
                    type: "Thanh toán",
                    amount: 0,
                    content: "",
                  });
                  setError("");
                  setShowForm(true);
                }}
                className={`inline-flex items-center gap-2 rounded-2xl ${theme.button} ${theme.buttonText} px-6 py-3 font-bold shadow-lg transition`}
              >
                <Plus size={18} /> Tạo báo cáo mới
              </button>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <SummaryCard
              label="Tổng báo cáo"
              value={reportSummary.total}
              theme={theme}
            />
            <SummaryCard
              label="Chờ duyệt"
              value={reportSummary.pending}
              color="yellow"
              theme={theme}
            />
            <SummaryCard
              label="Đã duyệt"
              value={reportSummary.approved}
              color="green"
              theme={theme}
            />
            <SummaryCard
              label="Đã từ chối"
              value={reportSummary.rejected}
              color="red"
              theme={theme}
            />
          </div>

          {!canReview && isApprovalPage ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-gray-500">
                Trang này chỉ dành cho Quản lý và Admin. Vui lòng sử dụng menu
                bên để chuyển sang báo cáo tài chính hoặc liên hệ quản trị hệ
                thống.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Danh sách báo cáo
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isApprovalPage
                      ? "Các báo cáo đang chờ duyệt hoặc đã xử lý."
                      : "Toàn bộ báo cáo tài chính hiện tại."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full ${theme.primaryBg} ${theme.primaryText} px-4 py-2 text-sm font-semibold opacity-80`}
                  >
                    Vai trò: {user.role || "Không xác định"}
                  </span>
                  <span className="rounded-full bg-gray-50 text-gray-600 px-4 py-2 text-sm">
                    {visibleReports.length} mục hiển thị
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-240">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-gray-500">
                        Tiêu đề
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-500">
                        Loại
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-500">
                        Số tiền
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-500">
                        Người lập
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-500">
                        Trạng thái
                      </th>
                      {isApprovalPage && (
                        <th className="p-4 text-sm font-semibold text-gray-500">
                          IC Summary
                        </th>
                      )}
                      <th className="p-4 text-sm font-semibold text-gray-500 text-center">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={isApprovalPage ? 7 : 6}
                          className="p-8 text-center text-gray-500"
                        >
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : visibleReports.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isApprovalPage ? 7 : 6}
                          className="p-8 text-center text-gray-500"
                        >
                          Không có báo cáo phù hợp.
                        </td>
                      </tr>
                    ) : (
                      visibleReports.map((report) => (
                        <tr
                          key={report._id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 font-semibold text-gray-800">
                            {report.title}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {report.type}
                          </td>
                          <td className="p-4 text-sm font-semibold text-red-600">
                            {Number(report.amount).toLocaleString()}đ
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {report.author?.fullName || "Ẩn danh"}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-bold ${
                                report.status === "Đã duyệt"
                                  ? "bg-green-100 text-green-700"
                                  : report.status === "Đã từ chối"
                                    ? "bg-red-100 text-red-700"
                                    : `${theme.primaryLight} ${theme.primaryLightText}`
                              }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          {isApprovalPage && (
                            <td className="p-4 text-sm text-gray-600">
                              {report.icSummary || "Chưa có"}
                            </td>
                          )}
                          <td className="p-4 flex flex-wrap justify-center gap-2">
                            <button
                              onClick={() => setSelectedReport(report)}
                              className={`${theme.primaryText} hover:opacity-70 font-semibold flex items-center gap-1`}
                            >
                              <Eye size={18} /> Xem
                            </button>
                            {!isApprovalPage &&
                              canModify(report) &&
                              report.status === "Chờ duyệt" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setFormData({ ...report });
                                      setError("");
                                      setShowForm(true);
                                    }}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    <Edit size={18} /> Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDelete(report._id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={18} /> Xóa
                                  </button>
                                </>
                              )}
                            {isApprovalPage &&
                              canReview &&
                              report.status === "Chờ duyệt" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleReview(report._id, "Đã duyệt")
                                    }
                                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                                  >
                                    <CheckCircle size={18} /> Duyệt
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleReview(report._id, "Đã từ chối")
                                    }
                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                  >
                                    <X size={18} /> Từ chối
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
            </div>
          )}
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in duration-200">
            <div
              className={`w-16 h-16 ${theme.primaryBg} ${theme.primaryText} opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <X size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Xác nhận đăng xuất
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Bạn có chắc chắn muốn rời khỏi hệ thống?
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
                className={`flex-1 py-3.5 font-bold ${theme.button} ${theme.buttonText} rounded-2xl shadow-lg transition-all`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedReport.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedReport.type} · {selectedReport.status}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <DetailRow
                  label="Người lập"
                  value={selectedReport.author?.fullName || "Ẩn danh"}
                />
                <DetailRow
                  label="Số tiền"
                  value={`${Number(selectedReport.amount).toLocaleString()}đ`}
                />
                <DetailRow label="Loại báo cáo" value={selectedReport.type} />
              </div>
              <div className="space-y-3">
                <DetailRow label="Trạng thái" value={selectedReport.status} />
                <DetailRow
                  label="Ngày tạo"
                  value={new Date(selectedReport.createdAt).toLocaleString()}
                />
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-gray-50 p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Nội dung báo cáo
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedReport.content}
              </p>
            </div>
            <div
              className={`mt-6 rounded-3xl ${theme.icBoxBg} p-6 border ${theme.icBoxBorder}`}
            >
              <h3 className={`text-lg font-semibold ${theme.icBoxText} mb-3`}>
                Phản hồi IC
              </h3>
              <p className={`${theme.primaryText} italic`}>
                {selectedReport.icSummary ||
                  "Chưa có phản hồi kiểm soát nội bộ."}
              </p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedReport(null)}
                className="inline-flex items-center justify-center rounded-2xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData._id ? "Sửa báo cáo" : "Tạo báo cáo mới"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Điền đầy đủ thông tin để gửi báo cáo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>
            <div className="grid gap-4">
              <input
                required
                className={`w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 ${theme.searchRing}`}
                placeholder="Tiêu đề"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <select
                className={`w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 ${theme.searchRing}`}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Thanh toán">Thanh toán</option>
                <option value="Tạm ứng hoàn ứng">Tạm ứng hoàn ứng</option>
                <option value="Báo cáo nội bộ">Báo cáo nội bộ</option>
              </select>
              <input
                type="number"
                className={`w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 ${theme.searchRing}`}
                placeholder="Số tiền"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
              />
              <textarea
                required
                className={`w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 ${theme.searchRing}`}
                rows={5}
                placeholder="Nội dung"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                <AlertTriangle
                  size={18}
                  className="inline-block mr-2 align-text-top"
                />{" "}
                {error}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className={`flex-1 rounded-2xl ${theme.button} ${theme.buttonText} px-6 py-3 font-semibold transition`}
              >
                Lưu báo cáo
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-2xl border border-gray-200 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color = "blue", theme }) => {
  const palette = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  // Nếu là card đầu tiên (Tổng báo cáo) thì dùng theme color
  let bgClass = palette[color];
  if (!color || color === "blue") {
    if (theme.primary === "#fbbf24") {
      bgClass = "bg-yellow-50 text-yellow-700 border-yellow-100";
    } else {
      bgClass = "bg-blue-50 text-blue-700 border-blue-100";
    }
  }

  return (
    <div className={`rounded-3xl border p-6 ${bgClass}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-[0.16em] text-gray-400">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-700">{value}</span>
  </div>
);

export default ReportManagement;
