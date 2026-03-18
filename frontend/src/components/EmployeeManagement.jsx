import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, FileText, BookOpen, Users, BarChart3, 
  UserCheck, Settings, LogOut, Search, Bell, Plus, 
  Eye, EyeOff, Lock, Unlock, ChevronDown, ChevronLeft, ChevronRight, X, Trash2
} from 'lucide-react';

const EmployeeManagement = () => {
  // 1. Quản lý dữ liệu nhân viên
  const [employees, setEmployees] = useState([
    { id: 1, name: "Vũ Trí Kiên", email: "Kien@company.com", dept: "Giám đốc", role: "Giám đốc", status: "Hoạt động" },
    { id: 2, name: "Nguyễn Hoàng Phúc Lân", email: "Lan@company.com", dept: "Kế toán", role: "Nhân viên", status: "Hoạt động" },
    { id: 3, name: "Phùng Thị Nga", email: "Nga@company.com", dept: "Nhân sự", role: "Nhân viên", status: "Hoạt động" },
    { id: 4, name: "Bùi Thu Ngân", email: "Ngan@company.com", dept: "Kinh doanh", role: "Nhân viên", status: "Hoạt động" },
    { id: 5, name: "Nguyễn Hoàng Anh", email: "Hanh@company.com", dept: "Kế toán", role: "Nhân viên", status: "Hoạt động" },
    { id: 6, name: "Nguyễn Kim Định", email: "Dinh@company.com", dept: "Kế toán", role: "Nhân viên", status: "Bị khóa" },
  ]);

  // 2. Trạng thái chức năng
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRealInfo, setShowRealInfo] = useState({});
  const [lockModal, setLockModal] = useState(null);
  const [confirmInput, setConfirmInput] = useState("");
  const itemsPerPage = 6;

  // States cho Modals mới
  const [deleteModal, setDeleteModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: "", email: "", dept: "", role: "" });
  const [errors, setErrors] = useState({});

  // 3. Logic Tìm kiếm & Phân trang
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentData = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 4. Xử lý Validation & Thêm mới
  const validate = () => {
    let tempErrors = {};
    if (!newEmp.name.trim()) tempErrors.name = "Tên nhân viên không được để trống";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmp.email) tempErrors.email = "Email không được để trống";
    else if (!emailRegex.test(newEmp.email)) tempErrors.email = "Định dạng email không hợp lệ";
    if (!newEmp.dept) tempErrors.dept = "Vui lòng chọn phòng ban";
    if (!newEmp.role) tempErrors.role = "Vui lòng chọn vai trò";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    if (validate()) {
      const addedAcc = { ...newEmp, id: Date.now(), status: "Hoạt động" };
      setEmployees([addedAcc, ...employees]);
      setShowAddModal(false);
      setNewEmp({ name: "", email: "", dept: "", role: "" });
      setErrors({});
      setCurrentPage(1);
    }
  };

  const handleDelete = () => {
    setEmployees(employees.filter(emp => emp.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const toggleEye = (id) => {
    setShowRealInfo(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmLock = () => {
    if (confirmInput === lockModal.name) {
      setEmployees(prev => prev.map(emp => 
        emp.id === lockModal.id ? { ...emp, status: emp.status === "Hoạt động" ? "Bị khóa" : "Hoạt động" } : emp
      ));
      setLockModal(null);
      setConfirmInput("");
    } else {
      alert("Tên nhân viên không khớp!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <aside className="w-[280px] bg-white border-r border-gray-100 p-6 flex flex-col text-left">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#0061f2] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">G</div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">GoFinance</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold text-left">Quản lý Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <NavItem icon={<FileText size={20}/>} label="Chứng từ kế toán" />
          <NavItem icon={<BookOpen size={20}/>} label="Sổ sách kế toán" />
          <NavItem icon={<Users size={20}/>} label="Quản lý công nợ" />
          <NavItem icon={<BarChart3 size={20}/>} label="Báo cáo tài chính" />
          <NavItem icon={<UserCheck size={20}/>} label="Phê duyệt báo cáo" />
          <NavItem icon={<Users size={20}/>} label="Quản lý nhân viên" active />
          <NavItem icon={<Settings size={20}/>} label="Cài đặt hệ thống" />
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all mt-auto font-semibold">
          <LogOut size={20}/> Đăng xuất
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">
        {/* HEADER - ĐÃ KHÔI PHỤC NGUYÊN BẢN PHẦN PROFILE USER */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm bằng tên hoặc email..." 
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2] text-sm" 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <Bell className="text-gray-400" size={22} />
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-10">
              <div className="text-right">
                <p className="text-base font-bold text-gray-800 leading-tight">User</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">manager</p>
              </div>
              <div className="w-12 h-12 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                VK
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-6 text-left">
          <section>
            <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Quản lý nhân viên</h2>
            <p className="text-gray-400 text-sm mt-1.5 font-normal italic">Đang hiển thị {filteredEmployees.length} nhân viên</p>
          </section>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#0061f2] text-white rounded-xl font-bold hover:bg-[#0052cc] transition-all shadow-md active:scale-95">
              <Plus size={18} /> Thêm mới
            </button>
            <div className="flex items-center gap-2">
              <FilterDropdown label="Tất cả phòng ban" />
              <FilterDropdown label="Tất cả trạng thái" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 uppercase">
                  <th className="px-6 py-5 font-bold text-gray-800 tracking-wider text-sm">Tên nhân viên</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-800 tracking-wider">Email</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-800 tracking-wider">Phòng ban</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-800 tracking-wider">Vai trò</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-800 tracking-wider text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-medium text-gray-800 text-sm">{emp.name}</td>
                    <td className="px-6 py-5 text-gray-500 text-sm">{showRealInfo[emp.id] ? emp.email : "********"}</td>
                    <td className="px-6 py-5 text-gray-500 text-sm">{showRealInfo[emp.id] ? emp.dept : "********"}</td>
                    <td className="px-6 py-5 text-gray-500 text-sm">{showRealInfo[emp.id] ? emp.role : "********"}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${emp.status === "Hoạt động" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                          {emp.status}
                        </span>
                        <button onClick={() => toggleEye(emp.id)} className="p-2 text-gray-400 hover:text-[#0061f2] hover:bg-blue-50 rounded-lg transition-all"><Eye size={18}/></button>
                        <button onClick={() => setLockModal(emp)} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"><Lock size={18}/></button>
                        <button onClick={() => setDeleteModal(emp)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* PHÂN TRANG */}
            <div className="p-6 bg-gray-50/30 border-t flex justify-between items-center">
              <span className="text-xs text-gray-400 font-medium">Trang {currentPage} / {totalPages || 1}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-2 border rounded-lg hover:bg-white disabled:opacity-20"><ChevronLeft size={16}/></button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="p-2 border rounded-lg hover:bg-white disabled:opacity-20"><ChevronRight size={16}/></button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL THÊM MỚI (Validation chữ đỏ) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left">
          <form onSubmit={handleCreateEmployee} className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Tạo tài khoản mới</h3>
              <X className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => {setShowAddModal(false); setErrors({});}} />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tên nhân viên</label>
                <input type="text" className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Vd: Nguyễn Văn A" value={newEmp.name} onChange={(e) => setNewEmp({...newEmp, name: e.target.value})} />
                {errors.name && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email đăng nhập</label>
                <input type="text" className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-500`} placeholder="name@company.com" value={newEmp.email} onChange={(e) => setNewEmp({...newEmp, email: e.target.value})} />
                {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.email}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phòng ban</label>
                  <select className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.dept ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-500`} value={newEmp.dept} onChange={(e) => setNewEmp({...newEmp, dept: e.target.value})}>
                    <option value="">Chọn...</option>
                    <option value="Giám đốc">Giám đốc</option><option value="Kế toán">Kế toán</option><option value="Nhân sự">Nhân sự</option>
                  </select>
                  {errors.dept && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.dept}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Vai trò</label>
                  <select className={`w-full mt-1 px-5 py-3 bg-gray-50 border ${errors.role ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-500`} value={newEmp.role} onChange={(e) => setNewEmp({...newEmp, role: e.target.value})}>
                    <option value="">Chọn...</option>
                    <option value="Quản lý">Quản lý</option><option value="Nhân viên">Nhân viên</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.role}</p>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl">Hủy bỏ</button>
              <button type="submit" className="flex-1 py-3 bg-[#0061f2] text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700">Xác nhận tạo</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA (Back/Xóa) */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={28}/></div>
            <h3 className="text-xl font-bold text-gray-800">Bạn muốn xóa tài khoản này?</h3>
            <p className="text-sm text-gray-400 mt-2">Dữ liệu của <strong>{deleteModal.name}</strong> sẽ bị gỡ vĩnh viễn khỏi hệ thống.</p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 font-bold text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Back lại</button>
              <button onClick={handleDelete} className="flex-1 py-3 font-bold text-white bg-red-500 rounded-2xl shadow-lg hover:bg-red-600 transition-all">Đồng ý xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KHÓA */}
      {lockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận {lockModal.status === "Hoạt động" ? "Khóa" : "Mở khóa"}</h3>
            <p className="text-sm text-gray-500 mb-6">Nhập chính xác tên <span className="font-bold text-gray-800">"{lockModal.name}"</span> để thực hiện.</p>
            <input type="text" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0061f2] mb-6" placeholder="Nhập tên nhân viên..." value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => {setLockModal(null); setConfirmInput("");}} className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl">Hủy</button>
              <button onClick={handleConfirmLock} className={`flex-1 py-3 font-bold text-white rounded-2xl shadow-lg ${lockModal.status === "Hoạt động" ? 'bg-red-500' : 'bg-green-500'}`}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-[#0061f2] font-bold shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const FilterDropdown = ({ label }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-100 transition-all">
    {label} <ChevronDown size={14} />
  </div>
);

export default EmployeeManagement;