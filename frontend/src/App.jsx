import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import EmployeeManagement from "./components/EmployeeManagement";
import ManagerEmployeeManagement from "./components/ManagerEmployeeManagement";

// 1. ProtectedRoute: Kiểm tra cả Token và User object
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  // Nếu thiếu token hoặc user thông tin, quay về trang đăng nhập
  if (!token || !userString) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 2. DashboardRedirect: Xử lý phân quyền tại node /dashboard
const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu là admin (Quản trị viên hệ thống)
  if (user?.role === "admin") {
    return <Dashboard />;
  }

  // Nếu là manager (Quản lý)
  if (user?.role === "manager" || user?.role === "quản lý") {
    return <ManagerDashboard />;
  }

  // Mặc định là nhân viên (Employee)
  return <EmployeeDashboard />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/" element={<Login />} />

        {/* QUAN TRỌNG: Điều hướng cả /dashboard và /manager-dashboard 
          về cùng một logic kiểm tra role để tránh lỗi bị văng ra ngoài
        */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Trang quản lý của ADMIN (Quản lý các Manager) */}
        <Route
          path="/employee-management"
          element={
            <ProtectedRoute>
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />

        {/* Trang quản lý của MANAGER (Quản lý nhân viên cấp dưới) */}
        <Route
          path="/manager-employee-management"
          element={
            <ProtectedRoute>
              <ManagerEmployeeManagement />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: Nếu vào link lạ thì về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;