import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  LayoutDashboard, FileText, BookOpen, Users, 
  BarChart3, UserCheck, Settings, LogOut, Search, 
  Plus, Eye, X, Trash2, Edit3, Bell, Lock, Unlock
} from 'lucide-react';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRealInfo, setShowRealInfo] = useState({});
  
  // States cho các loại Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal đăng xuất mới
  const [deleteModal, setDeleteModal] = useState(null);
  const [lockModal, setLockModal] = useState(null); 
  const [confirmName, setConfirmName] = useState(""); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const initialForm = { fullName: "", email: "", phone: "", dept: "", role: "manager", password: "" };
  const [newEmp, setNewEmp] = useState(initialForm);
  const [editEmp, setEditEmp] = useState(null);
  const [errors, setErrors] = useState({});

  const user = JSON.parse(localStorage.getItem("user")) || { fullName: "System Admin", role: "admin" };
  
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/users`, getAuthHeader());
      setEmployees(res.data);
    } catch (err) { 
      console.error("Lỗi:", err);
      if (err.response?.status === 401) navigate("/");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  // Logic xác nhận đăng xuất
  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      (emp.fullName || emp.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const validate = (data, isEdit) => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|84)(3|5|7|8|9)([0-9]{8})$/;
    const passRegex = /^[A-Z].*(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;

    if (!data.fullName && !data.name) newErrors.fullName = "Họ tên không được để trống";
    if (!data.dept) newErrors.dept = "Vui lòng chọn phòng ban";
    if (!emailRegex.test(data.email)) newErrors.email = "Email không đúng định dạng";
    if (!phoneRegex.test(data.phone)) newErrors.phone = "Số điện thoại không hợp lệ (10 số)";

    if (!isEdit) {
      if (!data.password) {
        newErrors.password = "Mật khẩu không được để trống";
      } else if (!passRegex.test(data.password)) {
        newErrors.password = "Mật khẩu phải > 5 ký tự, chữ đầu viết hoa và có 1 ký tự đặc biệt";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!validate(newEmp, false)) return;

    try {
      await axios.post(`${API_URL}/api/users/register`, newEmp, getAuthHeader());
      setShowAddModal(false);
      setNewEmp(initialForm);
      setErrors({});
      fetchEmployees();
    } catch (err) { alert(err.response?.data?.message || "Lỗi khi thêm"); }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!validate(editEmp, true)) return;

    try {
      await axios.put(`${API_URL}/api/users/${editEmp._id}`, editEmp, getAuthHeader());
      setShowEditModal(false);
      setErrors({});
      fetchEmployees();
    } catch (err) { alert("Lỗi cập nhật"); }
  };

  const handleToggleLock = async () => {
    const targetName = lockModal.fullName || lockModal.name;
    if (confirmName.trim() !== targetName.trim()) {
      alert("Tên xác nhận không chính xác!");
      return;
    }
    try {
      await axios.patch(`${API_URL}/api/users/toggle-lock/${lockModal._id}`, {}, getAuthHeader());
      setLockModal(null);
      setConfirmName("");
      fetchEmployees();
    } catch (err) { alert("Lỗi thao tác"); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/users/${deleteModal._id}`, getAuthHeader());
      setDeleteModal(null);
      fetchEmployees();
    } catch (err) { alert("Lỗi xóa"); }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-left relative">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-yellow-400 border-r border-yellow-500/20 p-6 flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-yellow-400 font-bold text-xl shadow-lg">A</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">APMS</h1>
            <p className="text-[10px] text-gray-700 uppercase tracking-widest font-semibold mt-1">ADMIN SYSTEM</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavItem icon={<FileText size={20} />} label="Chứng từ kế toán" />
          <NavItem icon={<BookOpen size={20} />} label="Sổ sách kế toán" />
          <NavItem icon={<Users size={20} />} label="Quản lý công nợ" />
          <NavItem icon={<BarChart3 size={20} />} label="Báo cáo tài chính" />
          <NavItem icon={<UserCheck size={20} />} label="Phê duyệt báo cáo" />
          <NavItem icon={<Users size={20} />} label="Quản lý nhân viên" active={true} onClick={() => navigate("/employee-management")} />
          <NavItem icon={<Settings size={20} />} label="Cài đặt hệ thống" />
        </nav>
        
        {/* Nút đăng xuất - Đã đổi sang gọi Modal */}
        <button 
          onClick={() => setShowLogoutModal(true)} 
          className="flex items-center gap-3 text-gray-900 p-4 hover:bg-black/10 rounded-xl transition-all mt-auto font-bold active:scale-95"
        >
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Tìm kiếm quản lý..." className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-yellow-400 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">{user.fullName}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">ADMIN</p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">A</div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6">
          <h2 className="text-3xl font-extrabold text-[#0f172a]">Quản lý nhân viên</h2>
          
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <button onClick={() => { setErrors({}); setNewEmp(initialForm); setShowAddModal(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-white rounded-xl font-bold hover:bg-yellow-500 shadow-md transition-all active:scale-95">
              <Plus size={18} /> Thêm Manager mới
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-[11px] font-bold text-gray-400 tracking-wider">
                  <th className="px-6 py-5">Họ và tên</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Số điện thoại</th>
                  <th className="px-6 py-5">Phòng ban</th>
                  <th className="px-6 py-5">Vai trò</th>
                  <th className="px-6 py-5 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className={`hover:bg-gray-50 transition-colors text-sm ${emp.isLocked ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-5 font-medium text-gray-800 flex items-center gap-2">
                      {emp.fullName || emp.name}
                      {emp.isLocked && <Lock size={12} className="text-red-500" />}
                    </td>
                    <td className="px-6 py-5 text-gray-500">{showRealInfo[emp._id] ? (emp.email || "---") : "********"}</td>
                    <td className="px-6 py-5 text-gray-500">{showRealInfo[emp._id] ? (emp.phone || "---") : "********"}</td>
                    <td className="px-6 py-5 text-gray-500">{emp.dept}</td>
                    <td className="px-6 py-5 text-gray-500 capitalize">{emp.role || 'manager'}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setShowRealInfo(p => ({...p, [emp._id]: !p[emp._id]}))} className="p-2 text-gray-400 hover:bg-yellow-100 rounded-lg"><Eye size={18}/></button>
                        <button onClick={() => { setErrors({}); setEditEmp({...emp, fullName: emp.fullName || emp.name}); setShowEditModal(true); }} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit3 size={18}/></button>
                        <button onClick={() => setLockModal(emp)} className={`p-2 rounded-lg transition-colors ${emp.isLocked ? 'text-orange-500 hover:bg-orange-100' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                          {emp.isLocked ? <Unlock size={18}/> : <Lock size={18}/>}
                        </button>
                        <button onClick={() => setDeleteModal(emp)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT (Giữ nguyên thiết kế như Dashboard) */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl text-center relative animate-in zoom-in duration-200">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <LogOut size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">Xác nhận thoát?</h3>
            <p className="text-gray-500 text-sm mt-3 px-4 leading-relaxed font-medium">
              Bạn có chắc chắn muốn rời khỏi hệ thống quản trị <span className="text-gray-900 font-bold">APMS</span> không?
            </p>
            <div className="flex flex-col gap-3 mt-10">
              <button 
                onClick={confirmLogout} 
                className="w-full py-4 font-bold text-white bg-red-500 rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
              >
                Đăng xuất ngay
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="w-full py-4 font-bold text-gray-500 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOCK/DELETE VÀ THÊM/SỬA (Giữ nguyên) */}
      {/* ... (Các modal khác giữ nguyên logic cũ của bạn) ... */}
      {lockModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{lockModal.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}</h3>
            <p className="text-gray-500 text-sm mb-4">Nhập tên <span className="font-bold text-gray-800">{lockModal.fullName || lockModal.name}</span> để xác nhận.</p>
            <input type="text" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 mb-6" value={confirmName} onChange={(e) => setConfirmName(e.target.value)} placeholder="Nhập tên chính xác..." />
            <div className="flex gap-3">
              <button onClick={() => {setLockModal(null); setConfirmName("");}} className="flex-1 py-3 text-gray-400 font-bold hover:bg-gray-50 rounded-xl">Hủy</button>
              <button onClick={handleToggleLock} className={`flex-1 py-3 text-white font-bold rounded-xl ${lockModal.isLocked ? 'bg-green-500' : 'bg-red-500'}`}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
            <h3 className="text-xl font-bold mb-2">Xác nhận xóa?</h3>
            <p className="text-gray-500 text-sm mb-6">Nhân viên <span className="font-bold">{deleteModal.fullName || deleteModal.name}</span> sẽ bị xóa vĩnh viễn.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 text-gray-400 font-bold hover:bg-gray-50 rounded-xl">Hủy</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}

      {(showAddModal || showEditModal) && (
        <EmployeeModal 
          title={showEditModal ? "Chỉnh sửa" : "Tạo tài khoản Quản lý"}
          data={showEditModal ? editEmp : newEmp}
          setData={showEditModal ? setEditEmp : setNewEmp}
          errors={errors}
          onClose={() => {setShowAddModal(false); setShowEditModal(false); setErrors({});}}
          onSubmit={showEditModal ? handleUpdateEmployee : handleCreateEmployee}
          isEdit={showEditModal}
        />
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${active ? "bg-white text-yellow-500 font-bold shadow-sm" : "text-gray-800 hover:bg-black/10 font-normal"}`}>
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const EmployeeModal = ({ title, data, setData, errors, onClose, onSubmit, isEdit = false }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
    <form onSubmit={onSubmit} className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl text-left">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <X className="cursor-pointer text-gray-400" onClick={onClose} />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Họ và tên</label>
          <input type="text" className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.fullName ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400`} value={data.fullName || data.name || ""} onChange={(e) => setData({...data, fullName: e.target.value, name: e.target.value})} />
          {errors.fullName && <p className="text-red-500 text-[11px] mt-1 ml-2 font-medium">{errors.fullName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
            <input type="email" className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400`} value={data.email || ""} onChange={(e) => setData({...data, email: e.target.value})} />
            {errors.email && <p className="text-red-500 text-[11px] mt-1 ml-2 font-medium">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Số điện thoại</label>
            <input type="text" className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400`} value={data.phone || ""} onChange={(e) => setData({...data, phone: e.target.value})} />
            {errors.phone && <p className="text-red-500 text-[11px] mt-1 ml-2 font-medium">{errors.phone}</p>}
          </div>
        </div>

        {!isEdit && (
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mật khẩu đăng nhập</label>
            <input 
              type="text" 
              placeholder="Ví dụ: Admin@123"
              className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400`} 
              value={data.password || ""} 
              onChange={(e) => setData({...data, password: e.target.value})} 
            />
            {errors.password && <p className="text-red-500 text-[11px] mt-1 ml-2 font-medium leading-tight">{errors.password}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phòng ban</label>
            <select className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.dept ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400`} value={data.dept || ""} onChange={(e) => setData({...data, dept: e.target.value})}>
              <option value="">Chọn...</option>
              <option value="Kế toán">Kế toán</option>
              <option value="Nhân sự">Nhân sự</option>
              <option value="Kinh doanh">Kinh doanh</option>
            </select>
            {errors.dept && <p className="text-red-500 text-[11px] mt-1 ml-2 font-medium">{errors.dept}</p>}
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Vai trò</label>
            <select 
              className={`w-full mt-1 px-5 py-3 rounded-2xl outline-none border border-gray-100 ${!isEdit ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-gray-50'}`}
              value={data.role || "manager"} 
              disabled={!isEdit} 
              onChange={(e) => setData({...data, role: e.target.value})}
            >
              <option value="manager">Manager</option>
              {isEdit && <option value="nhân viên">Nhân viên</option>}
              {isEdit && <option value="admin">Admin</option>}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-10">
        <button type="button" onClick={onClose} className="flex-1 py-3.5 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">Hủy bỏ</button>
        <button type="submit" className="flex-1 py-3.5 bg-yellow-400 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">Xác nhận</button>
      </div>
    </form>
  </div>
);

export default EmployeeManagement;