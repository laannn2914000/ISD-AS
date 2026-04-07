import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Search, Eye, CheckCircle, X, AlertTriangle } from "lucide-react";
import Sidebar from "./Sidebar";

// Hàm lấy theme color theo role
const getThemeByRole = (role) => {
  switch (role?.toLowerCase()) {
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
    default:
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
  }
};

const ApprovalManagement = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [reports, setReports] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
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
    [token]
  );

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/reports?keyword=${encodeURIComponent(keyword)}`, config);
      setReports(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải danh sách báo cáo.");
    } finally {
      setLoading(false);
    }
  }, [API_URL, keyword, config]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const visibleReports = useMemo(() => {
    let filtered = [...reports];
    // Sort by status: Chờ duyệt first, then Đã duyệt, then Đã từ chối
    filtered.sort((a, b) => {
      const order = { "Chờ duyệt": 0, "Đã duyệt": 1, "Đã từ chối": 2 };
      return (order[a.status] || 3) - (order[b.status] || 3);
    });
    return filtered;
  }, [reports]);

  const handleReview = async (id, status) => {
    const note = window.prompt(
      status === "Đã duyệt"
        ? "Nhập feedback/IC summary để duyệt:"
        : "Nhập lý do từ chối báo cáo:"
    );
    if (!note || !note.trim()) return alert("Phải nhập phản hồi kiểm soát nội bộ.");

    try {
      await axios.patch(`${API_URL}/api/reports/approve/${id}`, { status, icSummary: note.trim() }, config);
      fetchReports();
      setSelectedReport((prev) =>
        prev?._id === id ? { ...prev, status, icSummary: note.trim() } : prev
      );
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi cập nhật trạng thái báo cáo.");
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-left">
      <Sidebar user={user} setShowLogoutModal={setShowLogoutModal} />

      <div className="flex-1 overflow-y-auto">
        <header className="h-22 bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                <p className="text-base font-bold text-gray-800 leading-tight">{user.fullName || "Manager"}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">{user.role || "Manager"}</p>
              </div>
              <div className={`w-12 h-12 ${theme.avatar} rounded-full flex items-center justify-center ${theme.avatarText} font-bold text-lg shadow-md border-2 border-white`}>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8">
          <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Phê duyệt báo cáo</h1>
              <p className="text-gray-500 mt-2">Xem, đánh giá và phản hồi những báo cáo đang chờ duyệt.</p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <SummaryCard label="Tổng báo cáo" value={reports.length} theme={theme} />
            <SummaryCard label="Chờ duyệt" value={reports.filter((r) => r.status === "Chờ duyệt").length} color="yellow" theme={theme} />
            <SummaryCard label="Đã duyệt" value={reports.filter((r) => r.status === "Đã duyệt").length} color="green" theme={theme} />
            <SummaryCard label="Đã từ chối" value={reports.filter((r) => r.status === "Đã từ chối").length} color="red" theme={theme} />
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Danh sách báo cáo</h2>
                <p className="text-sm text-gray-500">Các báo cáo đang chờ duyệt hoặc đã xử lý.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className={`rounded-full ${theme.primaryBg} ${theme.primaryText} px-4 py-2 text-sm font-semibold opacity-80`}>Vai trò: {user.role || "Manager"}</span>
                <span className="rounded-full bg-gray-50 text-gray-600 px-4 py-2 text-sm">{visibleReports.length} mục hiển thị</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-240">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-500">Tiêu đề</th>
                    <th className="p-4 text-sm font-semibold text-gray-500">Loại</th>
                    <th className="p-4 text-sm font-semibold text-gray-500">Số tiền</th>
                    <th className="p-4 text-sm font-semibold text-gray-500">Người lập</th>
                    <th className="p-4 text-sm font-semibold text-gray-500">Trạng thái</th>
                    <th className="p-4 text-sm font-semibold text-gray-500">IC Summary</th>
                    <th className="p-4 text-sm font-semibold text-gray-500 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                    </tr>
                  ) : visibleReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">Không có báo cáo phù hợp.</td>
                    </tr>
                  ) : (
                    visibleReports.map((report) => (
                      <tr key={report._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-gray-800">{report.title}</td>
                        <td className="p-4 text-sm text-gray-600">{report.type}</td>
                        <td className="p-4 text-sm font-semibold text-red-600">{Number(report.amount).toLocaleString()}đ</td>
                        <td className="p-4 text-sm text-gray-600">{report.author?.fullName || "Ẩn danh"}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            report.status === "Đã duyệt"
                              ? "bg-green-100 text-green-700"
                              : report.status === "Đã từ chối"
                              ? "bg-red-100 text-red-700"
                              : `${theme.primaryLight} ${theme.primaryLightText}`
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{report.icSummary || "Chưa có"}</td>
                        <td className="p-4 flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className={`${theme.primaryText} hover:opacity-70 font-semibold flex items-center gap-1`}
                          >
                            <Eye size={18} /> Xem
                          </button>
                          {report.status === "Chờ duyệt" && (
                            <>
                              <button
                                onClick={() => handleReview(report._id, "Đã duyệt")}
                                className="text-green-600 hover:text-green-800 flex items-center gap-1"
                              >
                                <CheckCircle size={18} /> Duyệt
                              </button>
                              <button
                                onClick={() => handleReview(report._id, "Đã từ chối")}
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
        </main>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedReport.type} · {selectedReport.status}</p>
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
                <DetailRow label="Người lập" value={selectedReport.author?.fullName || "Ẩn danh"} />
                <DetailRow label="Số tiền" value={`${Number(selectedReport.amount).toLocaleString()}đ`} />
                <DetailRow label="Loại báo cáo" value={selectedReport.type} />
              </div>
              <div className="space-y-3">
                <DetailRow label="Trạng thái" value={selectedReport.status} />
                <DetailRow label="Ngày tạo" value={new Date(selectedReport.createdAt).toLocaleString()} />
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-gray-50 p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Nội dung báo cáo</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedReport.content}</p>
            </div>
            <div className={`mt-6 rounded-3xl ${theme.icBoxBg} p-6 border ${theme.icBoxBorder}`}>
              <h3 className={`text-lg font-semibold ${theme.icBoxText} mb-3`}>Phản hồi IC</h3>
              <p className={`${theme.primaryText} italic`}>{selectedReport.icSummary || "Chưa có phản hồi kiểm soát nội bộ."}</p>
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
    </div>
  );
};

export default ApprovalManagement;

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
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</p>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-[0.16em] text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-700">{value}</span>
  </div>
);

export default ApprovalManagement;
const SummaryCard = ({ label, value, color = "blue", theme }) => {
  const palette = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  let bgClass = palette[color];
  if (!color || color === "blue") {
    if (theme.primary === "#0061f2") {
      bgClass = "bg-blue-50 text-blue-700 border-blue-100";
    }
  }

  return (
    <div className={`rounded-3xl border p-6 ${bgClass}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</p>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-[0.16em] text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-700">{value}</span>
  </div>
);

export default ApprovalManagement;</content>
<parameter name="filePath">c:\Users\lanho\OneDrive\Documents\prj-isd\GoFinance_Project\frontend\src\components\ApprovalManagement.jsx