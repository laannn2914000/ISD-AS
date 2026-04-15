import React, { useState, useEffect } from "react";
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
  Eye
} from "lucide-react";

const ManagerReportSystem = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState({ show: false, type: "", id: "" });
  const [rejectComment, setRejectComment] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || { fullName: "Người dùng", role: "manager" };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/reports/search`, {
        params: { 
          name: searchTerm, 
          status: statusFilter === "All" ? "" : statusFilter 
        },
        headers: { Authorization: `Bearer ${token}` }
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
    const actionValue = type === "Approve" ? "approved" : "rejected";
    
    try {
      await axios.patch(`${API_URL}/api/reports/${id}/decide`, 
        { action: actionValue, comment: rejectComment },
        { headers: { Authorization: `Bearer ${token}` }}
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
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* SIDEBAR - GIỮ NGUYÊN BẢN GIAO DIỆN MÀU XANH CỦA BẠN */}
      <aside className="w-[280px] bg-[#0061f2] border-r border-white/10 p-6 flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0061f2] font-bold text-xl shadow-lg">M</div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">KTBM</h1>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Quản lý</p>
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
            label="Phê duyệt báo cáo"
            active={location.pathname === "/manager-reports" || active === true}
            onClick={() => navigate("/manager-reports")}
          />
          <NavItem icon={<BarChart3 size={20} />} label="Báo cáo tài chính" />
          <NavItem icon={<FileSearch size={20} />} label="Kiểm soát chứng từ" />
          <NavItem icon={<Settings size={20} />} label="Cài đặt" />
        </nav>

        <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-3 text-white p-4 hover:bg-white/10 rounded-xl transition-all mt-auto font-bold">
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo nhân viên..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchReports()}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Trưởng bộ phận</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
              {user.fullName.charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-10 flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Hệ thống phê duyệt</h2>
              <p className="text-gray-400 text-sm mt-1">Cập nhật và xử lý báo cáo từ cấp dưới</p>
            </div>
            <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
              {["All", "Submitted", "Approved", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === s ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {s === "All" ? "Tất cả" : s === "Submitted" ? "Đợi duyệt" : s === "Approved" ? "Đã duyệt" : "Đã từ chối"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-[32px] border border-dashed border-gray-200">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-gray-400 font-medium">Đang tải danh sách...</p>
            </div>
          ) : reports.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <div key={report._id} className="bg-white p-6 rounded-[24px] border border-gray-100 hover:shadow-lg transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      report.status === "approved" ? "bg-green-50 text-green-500" : 
                      report.status === "rejected" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                    }`}>
                      <FileCheck size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{report.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-medium text-gray-500">Người gửi: <span className="text-blue-600">{report.creatorName}</span></span>
                        <span className="text-gray-200">|</span>
                        <span className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      report.status === "approved" ? "bg-green-100 text-green-600" : 
                      report.status === "rejected" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {report.status}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100"><Eye size={18} /></button>
                      {report.status === "Submitted" && (
                        <>
                          <button onClick={() => setShowConfirmModal({ show: true, type: "Approve", id: report._id })} className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"><CheckCircle size={18} /></button>
                          <button onClick={() => setShowConfirmModal({ show: true, type: "Reject", id: report._id })} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><XCircle size={18} /></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                <FileSearch size={64} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium">Hiện không có báo cáo nào cần xử lý</p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL PHÊ DUYỆT / TỪ CHỐI */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {showConfirmModal.type === "Approve" ? "Xác nhận phê duyệt" : "Từ chối báo cáo"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">Hành động này sẽ cập nhật trạng thái báo cáo chính thức trên hệ thống.</p>
            
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
              <button onClick={() => { setShowConfirmModal({ show: false, type: "", id: "" }); setRejectComment(""); }} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Hủy</button>
              <button onClick={handleAction} className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all ${showConfirmModal.type === "Approve" ? "bg-green-600 shadow-green-100 hover:bg-green-700" : "bg-red-600 shadow-red-100 hover:bg-red-700"}`}>Xác nhận</button>
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
            <p className="text-gray-500 text-sm mb-6">Bạn có chắc chắn muốn rời khỏi phiên làm việc này?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200">Hủy</button>
              <button onClick={confirmLogout} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600">Đăng xuất</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// NavItem giữ đúng style màu trắng trên nền xanh của bạn
const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-white/20 text-white font-bold shadow-inner"
        : "text-blue-100 hover:bg-white/10 hover:text-white"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

export default ManagerReportSystem;