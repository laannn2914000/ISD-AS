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
  Save,
  Mail,
  Phone,
  Building,
  Calendar,
  Edit3,
  CheckCircle,
} from "lucide-react";

const EmployeeProfile = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Người dùng",
    role: "nhân viên",
    email: "",
  };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: currentUser.fullName || "",
    email: currentUser.email || "",
    phone: "",
    dept: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Lấy thông tin user từ API
        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          dept: res.data.dept || "",
        });
      } catch (err) {
        console.error("Lỗi tải profile:", err);
        // Sử dụng thông tin từ localStorage nếu API lỗi
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [API_URL, token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cập nhật thông tin thành công!");
      setEditing(false);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, ...formData }),
      );
    } catch (err) {
      alert(
        "Lỗi cập nhật: " + (err.response?.data?.message || "Không thể kết nối"),
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Đang tải thông tin...</p>
      </div>
    );
  }

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
            onClick={() => navigate("/employee-dashboard")}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Báo cáo của tôi"
            onClick={() => navigate("/employee-reports")}
          />
          <NavItem
            icon={<FilePlus size={20} />}
            label="Tạo báo cáo"
            onClick={() => navigate("/employee-create-report")}
          />
          <NavItem
            icon={<User size={20} />}
            label="Thông tin cá nhân"
            active={true}
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
          <div className="relative flex-1 max-w-2xl">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2] text-sm"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">
                  {user?.fullName || "Người dùng"}
                </p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">
                  Nhân viên
                </p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 text-left">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                  Thông tin cá nhân
                </h2>
                <p className="text-gray-400 text-sm mt-1.5">
                  Quản lý thông tin cá nhân của bạn
                </p>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0061f2] text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  <Edit3 size={18} /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save size={18} /> {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Avatar Section */}
              <div className="bg-gradient-to-r from-[#0061f2] to-[#0052cc] p-10 text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-[#0061f2] font-bold text-5xl shadow-lg mx-auto mb-4">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {user?.fullName || "Người dùng"}
                </h3>
                <p className="text-blue-200 mt-1">Nhân viên</p>
              </div>

              {/* Info Section */}
              <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="font-bold text-gray-800 text-lg mb-4">
                      Thông tin cơ bản
                    </h4>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-blue-50 text-[#0061f2] rounded-lg">
                        <User size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Họ và tên
                        </p>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full mt-1 p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          />
                        ) : (
                          <p className="font-bold text-gray-800">
                            {user?.fullName || "---"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-blue-50 text-[#0061f2] rounded-lg">
                        <Mail size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Email
                        </p>
                        {editing ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="w-full mt-1 p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          />
                        ) : (
                          <p className="font-bold text-gray-800">
                            {user?.email || "---"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-blue-50 text-[#0061f2] rounded-lg">
                        <Phone size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Số điện thoại
                        </p>
                        {editing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full mt-1 p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          />
                        ) : (
                          <p className="font-bold text-gray-800">
                            {user?.phone || "Chưa cập nhật"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-bold text-gray-800 text-lg mb-4">
                      Thông tin công việc
                    </h4>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <Building size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Bộ phận
                        </p>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.dept}
                            onChange={(e) =>
                              setFormData({ ...formData, dept: e.target.value })
                            }
                            className="w-full mt-1 p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          />
                        ) : (
                          <p className="font-bold text-gray-800">
                            {user?.dept || "Chưa cập nhật"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <CheckCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Vai trò
                        </p>
                        <p className="font-bold text-gray-800">Nhân viên</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                        <Calendar size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Ngày tham gia
                        </p>
                        <p className="font-bold text-gray-800">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "vi-VN",
                              )
                            : "---"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center">
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

export default EmployeeProfile;
