import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCheck, BarChart3, Settings,
  LogOut, Search, Bell, Loader2, Plus, Edit2, Trash2, Lock, Unlock, X, Key
} from "lucide-react";

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // FORM STATE: Đã thêm trường password
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", dept: "", role: "nhân viên", password: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || { fullName: "Manager", role: "manager" };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi tải người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/api/users/${editingUser._id}`, formData);
      } else {
        // Gửi kèm cả password khi tạo mới
        await axios.post(`${API_URL}/api/users/register`, formData);
      }
      setShowUserModal(false);
      setEditingUser(null);
      setFormData({ name: "", email: "", phone: "", dept: "", role: "nhân viên", password: "" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#0061f2] mb-4" size={40} />
      <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-left relative">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-[#0061f2] p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2 text-white">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0061f2] font-bold text-xl shadow-lg">M</div>
          <div>
            <h1 className="text-xl font-bold">APMS</h1>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">MANAGER SYSTEM</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {/* QUAN TRỌNG: Kiểm tra lại route này có đúng với App.js của bạn không */}
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
          <NavItem icon={<UserCheck size={20} />} label="Phê duyệt" />
          <NavItem icon={<BarChart3 size={20} />} label="Báo cáo" />
          <NavItem icon={<Settings size={20} />} label="Cài đặt" />
        </nav>

        <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-3 text-white p-4 hover:bg-white/10 rounded-xl transition-all mt-auto font-bold active:scale-95">
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto text-left">
        {/* HEADER */}
        <header className="h-[88px] bg-white border-b flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Tìm kiếm nhân viên..." className="w-full pl-14 pr-6 py-3 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2]" />
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l h-10 text-left">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">{user.fullName}</p>
                <p className="text-xs text-[#0061f2] font-bold uppercase tracking-tight">Manager</p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                {user.fullName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-10 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Quản lý nhân viên</h2>
              <p className="text-gray-400 text-sm mt-1">Giao diện quản trị dành cho cấp Quản lý</p>
            </div>
            <button 
              onClick={() => { setEditingUser(null); setFormData({name:"", email:"", phone:"", dept:"", role:"nhân viên", password:""}); setShowUserModal(true); }}
              className="bg-[#0061f2] hover:bg-[#0052cc] text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus size={20} /> Thêm nhân viên mới
            </button>
          </div>

          {/* TABLE - Thiết kế giống Admin nhưng màu Xanh */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Họ tên / Email</th>
                  <th className="px-8 py-5">Phòng ban</th>
                  <th className="px-8 py-5">Vai trò</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className={`hover:bg-gray-50/50 transition-colors ${u.isLocked ? "opacity-50" : ""}`}>
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-800">{u.fullName}</p>
                      <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-blue-50 text-[#0061f2] rounded-lg text-xs font-bold">{u.dept || "N/A"}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-500 uppercase">{u.role}</span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button onClick={() => { setEditingUser(u); setFormData({ name: u.fullName, email: u.email, phone: u.phone, dept: u.dept, role: u.role, password: u.password }); setShowUserModal(true); }} className="p-2.5 bg-blue-50 text-[#0061f2] rounded-xl"><Edit2 size={18} /></button>
                      <button className="p-2.5 bg-red-50 text-red-500 rounded-xl"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* MODAL THÊM/SỬA - ĐÃ THÊM TRƯỜNG PASSWORD */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-200 text-left">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800">{editingUser ? "Sửa nhân viên" : "Tạo nhân viên mới"}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmitUser} className="space-y-4">
              <input type="text" placeholder="Họ và tên" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-[#0061f2]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input type="email" placeholder="Email đăng nhập" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-[#0061f2]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              
              {/* TRƯỜNG PASSWORD QUAN TRỌNG */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Mật khẩu tài khoản" 
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-[#0061f2] pr-12 font-mono" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required={!editingUser} 
                />
                <Key className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Phòng ban" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-[#0061f2]" value={formData.dept} onChange={(e) => setFormData({...formData, dept: e.target.value})} />
                <select className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="nhân viên">Nhân viên</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <button className="w-full py-4.5 bg-[#0061f2] text-white font-bold rounded-2xl shadow-lg hover:bg-[#0052cc] transition-all mt-4">Xác nhận lưu</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${active ? "bg-white/20 text-white font-bold shadow-sm" : "text-blue-100 hover:bg-white/10 hover:text-white"}`}>
    {icon} <span className="text-sm">{label}</span>
  </div>
);

export default ManagerDashboard;