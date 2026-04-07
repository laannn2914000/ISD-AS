import React, { useMemo, useEffect } from "react";
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

// Hàm lấy theme color theo role
const getThemeByRole = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return {
        primary: "#fbbf24",
        sidebarBg: "bg-yellow-400",
        sidebarBorder: "border-yellow-500/20",
        logoBg: "bg-gray-900",
        logoText: "text-yellow-400",
        titleText: "text-gray-900",
        activeBg: "bg-white",
        activeText: "text-yellow-400",
        activeFont: "font-bold",
        activeShadow: "shadow-md",
        inactiveText: "text-gray-800",
        inactiveHover: "hover:bg-black/10",
        inactiveHoverText: "hover:text-gray-900",
        logoutText: "text-gray-900",
        logoutHover: "hover:bg-black/10",
      };
    case "manager":
    case "quản lý":
      return {
        primary: "#0061f2",
        sidebarBg: "bg-[#0061f2]",
        sidebarBorder: "border-white/10",
        logoBg: "bg-white",
        logoText: "text-[#0061f2]",
        titleText: "text-white",
        activeBg: "bg-white/20",
        activeText: "text-white",
        activeFont: "font-bold",
        activeShadow: "shadow-sm",
        inactiveText: "text-blue-100",
        inactiveHover: "hover:bg-white/10",
        inactiveHoverText: "hover:text-white",
        logoutText: "text-white",
        logoutHover: "hover:bg-white/10",
      };
    default: // Employee
      return {
        primary: "#0061f2",
        sidebarBg: "bg-white",
        sidebarBorder: "border-gray-100",
        logoBg: "bg-[#0061f2]",
        logoText: "text-white",
        titleText: "text-[#0f172a]",
        activeBg: "bg-blue-50",
        activeText: "text-[#0061f2]",
        activeFont: "font-bold",
        activeShadow: "shadow-sm",
        inactiveText: "text-gray-400",
        inactiveHover: "hover:bg-gray-50",
        inactiveHoverText: "hover:text-gray-600",
        logoutText: "text-red-500",
        logoutHover: "hover:bg-red-50",
      };
  }
};

const Sidebar = ({ user: userProp, setShowLogoutModal }) => {
  console.log("=== SIDEBAR COMPONENT RENDERED ===");
  console.log("userProp received:", userProp);
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback to localStorage if user prop is not provided or doesn't have role - wrapped in useMemo to avoid dependency issues
  const user = useMemo(() => {
    // Check if userProp has a role property - if not, fall back to localStorage
    if (userProp && userProp.role) {
      return userProp;
    }
    return JSON.parse(localStorage.getItem("user")) || {};
  }, [userProp]);

  const theme = useMemo(() => getThemeByRole(user?.role), [user?.role]);

  // Normalize role name để xử lý cả English và Vietnamese
  const normalizeRole = (role) => {
    if (!role) return "";
    const lower = role.toLowerCase().trim();
    console.log("normalizeRole input:", role, "-> lower:", lower);
    if (lower === "quản lý") return "manager";
    if (lower === "nhân viên") return "employee";
    return lower;
  };

  // 1. Định nghĩa danh sách menu cho từng Role
  const getMenuItems = (role) => {
    console.log("getMenuItems called with role:", role);
    if (!role) {
      console.log("getMenuItems: role is empty/null");
      return [];
    }

    const normalizedRole = normalizeRole(role);
    console.log("getMenuItems: normalizedRole =", normalizedRole);
    const isManager = normalizedRole === "manager";
    const isEmployee = normalizedRole === "employee";
    const isAdmin = normalizedRole === "admin";

    console.log(
      "getMenuItems: isAdmin =",
      isAdmin,
      "isManager =",
      isManager,
      "isEmployee =",
      isEmployee,
    );

    if (isAdmin) {
      console.log("getMenuItems: returning Admin menu");
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
        { icon: <Users size={20} />, label: "Quản lý công nợ", path: "/debt" },
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
    }
    if (isManager) {
      console.log("getMenuItems: returning Manager menu");
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
    }
    if (isEmployee) {
      console.log("getMenuItems: returning Employee menu");
      return [
        {
          icon: <LayoutDashboard size={20} />,
          label: "Dashboard",
          path: "/employee-dashboard",
        },
        {
          icon: <FileText size={20} />,
          label: "Báo cáo của tôi",
          path: "/reports",
        },
        { icon: <History size={20} />, label: "Lịch sử", path: "/history" },
        {
          icon: <Settings size={20} />,
          label: "Hồ sơ cá nhân",
          path: "/profile",
        },
      ];
    }
    console.log("getMenuItems: no matching role, returning empty array");
    return [];
  };

  const menuItems = useMemo(() => getMenuItems(user?.role), [user?.role]);

  useEffect(() => {
    console.log("=== SIDEBAR DEBUG ===");
    console.log("user:", user);
    console.log("user?.role:", user?.role);
    console.log("menuItems.length:", menuItems.length);
    console.log("menuItems:", menuItems);
  }, [user, menuItems]);

  return (
    <aside
      className={`w-[280px] ${theme.sidebarBg} border-r ${theme.sidebarBorder} p-6 flex flex-col h-screen sticky top-0 transition-colors duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div
          className={`w-10 h-10 ${theme.logoBg} rounded-xl flex items-center justify-center ${theme.logoText} font-bold text-xl shadow-lg`}
        >
          {user?.role?.charAt(0).toUpperCase() || "G"}
        </div>
        <div>
          <h1 className={`text-xl font-bold ${theme.titleText} leading-none`}>
            KTBM
          </h1>
          <p
            className={`text-[10px] ${
              user?.role?.toLowerCase() === "admin"
                ? "text-gray-700"
                : user?.role?.toLowerCase() === "manager" ||
                    user?.role?.toLowerCase() === "quản lý"
                  ? "text-blue-200"
                  : "text-gray-400"
            } uppercase tracking-widest font-semibold mt-1`}
          >
            {user?.role || "Khách"}
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {console.log(
          "Rendering nav items, menuItems.length:",
          menuItems.length,
        )}
        {menuItems && menuItems.length > 0 ? (
          menuItems.map((item, index) => {
            console.log(`Rendering menu item ${index}:`, item.label, item.path);
            return (
              <div
                key={index}
                onClick={() => {
                  console.log("Click menu:", item.label, "->", item.path);
                  navigate(item.path);
                }}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all pointer-events-auto relative z-10 ${
                  location.pathname === item.path
                    ? `${theme.activeBg} ${theme.activeText} ${theme.activeFont} ${theme.activeShadow}`
                    : `${theme.inactiveText} ${theme.inactiveHover} ${theme.inactiveHoverText}`
                }`}
              >
                {item.icon} <span className="text-sm">{item.label}</span>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-gray-500 py-4 text-center space-y-2">
            <p>Role: {user?.role || "undefined"}</p>
            <p>Menu items: {menuItems?.length || 0}</p>
            <button
              onClick={() => {
                console.log("Manual click to /approvals");
                navigate("/approvals");
              }}
              className="w-full px-2 py-2 mt-2 rounded bg-blue-500 text-white text-xs"
            >
              Manual: /approvals
            </button>
          </div>
        )}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className={`flex items-center gap-3 ${theme.logoutText} p-4 ${theme.logoutHover} rounded-xl transition-all mt-auto font-semibold active:scale-95`}
      >
        <LogOut size={20} /> Đăng xuất
      </button>
    </aside>
  );
};

export default Sidebar;
