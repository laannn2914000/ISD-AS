import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, BookOpen, Users, BarChart3, 
  UserCheck, Settings, LogOut, Search, Bell, Plus, 
  Eye, Lock, ChevronDown, Filter
} from 'lucide-react';

const EmployeeManagement = () => {
  // Dữ liệu mẫu dựa trên thiết kế của bạn
  const [employees] = useState([
    { name: "Vũ Trí Kiên", email: "Kien@company.com", dept: "Giám đốc", role: "Giám đốc", status: "Hoạt động" },
    { name: "Nguyễn Hoàng Phúc Lân", email: "Lan@company.com", dept: "Kế toán", role: "Nhân viên", status: "Hoạt động" },
    { name: "Phùng Thị Nga", email: "Nga@company.com", dept: "Nhân sự", role: "Nhân viên", status: "Hoạt động" },
    { name: "Bùi Thu Ngân", email: "Ngan@company.com", dept: "Kinh doanh", role: "Nhân viên", status: "Hoạt động" },
    { name: "Nguyễn Hoàng Anh", email: "Hanh@company.com", dept: "Kế toán", role: "Nhân viên", status: "Hoạt động" },
    { name: "Nguyễn Kim Định", email: "Dinh@company.com", dept: "Kế toán", role: "Nhân viên", status: "Bị khóa" },
  ]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* SIDEBAR - Giữ nguyên từ trang Manager */}
      <aside className="w-[280px] bg-white border-r border-gray-100 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#0061f2] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">G</div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">GoFinance</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold text-left">Quản lý Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 text-left">
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
        {/* HEADER - Giữ nguyên (Search dài + Profile "User") */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <div className="relative flex-1 max-w-2xl text-left">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên, phòng ban..." 
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2] text-sm" 
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

        {/* MAIN CONTENT - Quản lý nhân viên */}
        <main className="p-10 space-y-6 text-left">
          <section>
            <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight text-left">Quản lý nhân viên</h2>
            <p className="text-gray-400 text-sm mt-1.5 font-normal text-left">Quản lý tài khoản và thông tin nhân viên trong hệ thống</p>
          </section>

          {/* THANH CÔNG CỤ (Thêm mới & Lọc) */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0061f2] text-white rounded-xl font-bold hover:bg-[#0052cc] transition-all shadow-md">
                <Plus size={18} /> Thêm mới
              </button>
              <div className="relative ml-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Tên/Email" className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 outline-none" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FilterDropdown label="Tất cả phòng ban" />
              <FilterDropdown label="Tất cả vai trò" />
              <FilterDropdown label="Tất cả trạng thái" />
            </div>
          </div>

          {/* BẢNG DANH SÁCH NHÂN VIÊN */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 uppercase">
                  <th className="px-8 py-5 text-[11px] font-bold text-gray-500 tracking-wider">Tên nhân viên</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-500 tracking-wider">Email</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-500 tracking-wider">Phòng ban</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-500 tracking-wider">Vai trò</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-500 tracking-wider text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map((emp, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-gray-800 text-sm">{emp.name}</td>
                    <td className="px-6 py-5 text-gray-500 text-sm font-medium">{emp.email}</td>
                    <td className="px-6 py-5 text-gray-500 text-sm font-medium">{emp.dept}</td>
                    <td className="px-6 py-5 text-gray-500 text-sm font-medium">{emp.role}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${
                          emp.status === "Hoạt động" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}>
                          {emp.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-[#0061f2] hover:bg-blue-50 rounded-lg transition-all"><Eye size={18}/></button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Lock size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

// Component con để tối ưu code
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