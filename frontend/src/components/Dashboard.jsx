import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, FileText, BookOpen, Users, BarChart3, 
  UserCheck, Settings, LogOut, Search, Bell, Clock, 
  TrendingUp, ChevronUp, ChevronDown, Check, X, Eye, Loader2 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lấy thông tin user từ localStorage sau khi đăng nhập thành công
  const user = JSON.parse(localStorage.getItem("user")) || { fullName: "Hệ thống", role: "Admin" };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gọi đến route /api/dashboard-stats bạn vừa thêm ở Backend
        const res = await axios.get(`${API_URL}/api/dashboard-stats`);
        setData(res.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu từ Atlas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [API_URL]);

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#0061f2] mb-4" size={40} />
      <p className="text-gray-500 font-medium">Đang tải dữ liệu từ Atlas...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* SIDEBAR - Cột trái */}
      <aside className="w-72 bg-white border-r border-gray-100 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#0061f2] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">APMS</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Accounting System</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<FileText size={20}/>} label="Chứng từ kế toán" />
          <NavItem icon={<BookOpen size={20}/>} label="Sổ sách kế toán" />
          <NavItem icon={<Users size={20}/>} label="Quản lý công nợ" />
          <NavItem icon={<BarChart3 size={20}/>} label="Báo cáo tài chính" />
          <NavItem icon={<UserCheck size={20}/>} label="Phê duyệt báo cáo" />
          <NavItem icon={<Users size={20}/>} label="Quản lý nhân viên" />
          <NavItem icon={<Settings size={20}/>} label="Cài đặt hệ thống" />
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all mt-auto font-semibold active:scale-95">
          <LogOut size={20}/> Đăng xuất
        </button>
      </aside>

      {/* MAIN CONTENT - Cột phải */}
      <div className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Tìm kiếm báo cáo hoặc chứng từ..." className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-full text-sm outline-none focus:ring-1 focus:ring-[#0061f2]" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full cursor-pointer">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-[#0061f2] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user.fullName.split(' ').pop().charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-[#0f172a]">Dashboard</h2>
            <p className="text-gray-400 text-sm mt-1">Tổng quan hệ thống quản lý quy trình kế toán</p>
          </section>

          {/* STAT CARDS - 4 thẻ thông số ở trên */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<FileText className="text-[#0061f2]"/>} bg="bg-blue-50" label="Tổng số chứng từ" value={data?.stats.totalDocs} sub="Tổng số chứng từ trong hệ thống" />
            <StatCard icon={<Clock className="text-orange-500"/>} bg="bg-orange-50" label="Báo cáo chờ duyệt" value={data?.stats.pendingReports} sub="Cần xử lý trong tuần này" />
            <StatCard icon={<TrendingUp className="text-green-500"/>} bg="bg-green-50" label="Công nợ phải thu" value={data?.stats.receivable} sub="VND - Cập nhật hôm nay" trend="+12%" />
            <StatCard icon={<BarChart3 className="text-red-500"/>} bg="bg-red-50" label="Công nợ phải trả" value={data?.stats.payable} sub="VND - Cập nhật hôm nay" trend="-5%" isDown />
          </div>

          {/* BIỂU ĐỒ - Financial Overview */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Financial Overview</h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}} />
                    <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} dot={{r: 6, fill: '#dc2626', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* TABLES AREA - Hai bảng dưới cùng */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BẢNG 1: CHỨNG TỪ KẾ TOÁN GẦN ĐÂY */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Chứng từ kế toán gần đây</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-400 border-b border-gray-50">
                    <tr className="text-left">
                      <th className="pb-4 font-semibold">Mã chứng từ</th>
                      <th className="pb-4 font-semibold">Phòng ban</th>
                      <th className="pb-4 font-semibold">Người tạo</th>
                      <th className="pb-4 font-semibold text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentDocuments.map((doc, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-all">
                        <td className="py-4 font-bold text-gray-800">{doc.docId || doc._id.substring(0,8)}</td>
                        <td className="py-4 text-gray-500">{doc.department}</td>
                        <td className="py-4 text-gray-600">{doc.creator}</td>
                        <td className="py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(doc.status)}`}>
                            {doc.status || "Mới"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BẢNG 2: YÊU CẦU PHÊ DUYỆT */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Yêu cầu phê duyệt</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-400 border-b border-gray-50">
                    <tr className="text-left">
                      <th className="pb-4 font-semibold">Tên báo cáo</th>
                      <th className="pb-4 font-semibold">Số tiền</th>
                      <th className="pb-4 font-semibold">Người gửi</th>
                      <th className="pb-4 font-semibold text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.approvalRequests.map((app, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-4">
                          <p className="font-bold text-gray-800">{app.name}</p>
                          <p className="text-[10px] text-gray-400">Cập nhật 1 giờ trước</p>
                        </td>
                        <td className="py-4 text-gray-800 font-bold">{app.amount}</td>
                        <td className="py-4 text-gray-600">{app.sender}</td>
                        <td className="py-4 text-right flex justify-end gap-2">
                           <button className="p-2 text-gray-400 hover:text-[#0061f2] hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16}/></button>
                           <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"><Check size={16}/></button>
                           <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- COMPONENTS HỖ TRỢ ---
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-[#0061f2] font-bold shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const StatCard = ({ icon, bg, label, value, sub, trend, isDown }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-tight">{label}</p>
        <p className="text-3xl font-extrabold text-[#0f172a]">{value}</p>
      </div>
      <div className={`${bg} p-4 rounded-2xl`}>{icon}</div>
    </div>
    <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
    {trend && (
      <div className={`absolute bottom-6 right-6 flex items-center gap-1 text-[10px] font-bold ${isDown ? 'text-red-500' : 'text-green-500'}`}>
        {isDown ? <ChevronDown size={14}/> : <ChevronUp size={14}/>} {trend}
      </div>
    )}
  </div>
);

const getStatusColor = (s) => {
  if (s === "Đã duyệt") return "bg-green-50 text-green-600";
  if (s === "Từ chối") return "bg-red-50 text-red-600";
  return "bg-orange-50 text-orange-600";
};

const chartData = [
  {name: 'Jan', value: 45}, {name: 'Feb', value: 52}, {name: 'Mar', value: 48},
  {name: 'Apr', value: 62}, {name: 'May', value: 55}, {name: 'Jun', value: 68},
  {name: 'Jul', value: 58}, {name: 'Aug', value: 65}, {name: 'Sep', value: 71},
  {name: 'Oct', value: 66}, {name: 'Nov', value: 73}, {name: 'Dec', value: 80},
];

export default Dashboard;