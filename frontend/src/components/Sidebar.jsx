import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  FilePlus,
  History,
} from "lucide-react";

const Sidebar = ({ user, setShowLogoutModal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Định nghĩa danh sách menu cho từng Role
  const getMenuItems = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return [
          {
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
            path: "/dashboard",
          },
          {
            icon: <FileText size={20} />,
            label: "Chứng từ kế toán",
            path: "/documents",
          },
          {
            icon: <BookOpen size={20} />,
            label: "Sổ sách kế toán",
            path: "/books",
          },
          {
            icon: <Users size={20} />,
            label: "Quản lý công nợ",
            path: "/debt",
          },
          {
            icon: <BarChart3 size={20} />,
            label: "Báo cáo tài chính",
            path: "/reports",
          },
          {
            icon: <UserCheck size={20} />,
            label: "Phê duyệt báo cáo",
            path: "/approvals",
          },
          {
            icon: <Users size={20} />,
            label: "Quản lý nhân viên",
            path: "/employee-management",
          },
          {
            icon: <Settings size={20} />,
            label: "Cài đặt hệ thống",
            path: "/settings",
          },
        ];
      case "manager":
        return [
          {
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
            path: "/manager-dashboard",
          },
          {
            icon: <FileText size={20} />,
            label: "Chứng từ kế toán",
            path: "/documents",
          },
          {
            icon: <BarChart3 size={20} />,
            label: "Báo cáo tài chính",
            path: "/reports",
          },
          {
            icon: <UserCheck size={20} />,
            label: "Phê duyệt báo cáo",
            path: "/approvals",
          },
          {
            icon: <Settings size={20} />,
            label: "Cài đặt cá nhân",
            path: "/settings",
          },
        ];
      case "nhân viên":
      case "employee":
        return [
          {
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
            path: "/employee-dashboard",
          },
          {
            icon: <FilePlus size={20} />,
            label: "Tạo chứng từ mới",
            path: "/create-document",
          },
          {
            icon: <History size={20} />,
            label: "Lịch sử chứng từ",
            path: "/history",
          },
          {
            icon: <Settings size={20} />,
            label: "Hồ sơ cá nhân",
            path: "/profile",
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems(user?.role);

  return (
    <aside className="w-[280px] bg-white border-r border-gray-100 p-6 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-[#0061f2] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {user?.role?.charAt(0).toUpperCase() || "G"}
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">GoFinance</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            {user?.role} System
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
              location.pathname === item.path
                ? "bg-blue-50 text-[#0061f2] font-bold shadow-sm"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            }`}
          >
            {item.icon} <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="flex items-center gap-3 text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all mt-auto font-semibold active:scale-95"
      >
        <LogOut size={20} /> Đăng xuất
      </button>
    </aside>
  );
};

export default Sidebar;
