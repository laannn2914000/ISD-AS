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

// 1. Cải tiến ProtectedRoute: Kiểm tra cả Token và User object
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  // Nếu thiếu token hoặc user, quay về trang đăng nhập
  if (!token || !userString) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 2. DashboardRedirect: Đảm bảo kiểm tra đúng Role từ MongoDB Atlas
const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu là admin, hiển thị trang Admin cũ
  if (user?.role === "admin") {
    return <Dashboard />;
  }

  // Nếu là manager (quản lý)
  if (user?.role === "manager" || user?.role === "quản lý") {
    return <ManagerDashboard />;
  }

  // Còn lại là nhân viên (employee)
  return <EmployeeDashboard />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/" element={<Login />} />

        {/* Route Dashboard duy nhất xử lý phân quyền */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-management"
          element={
            <ProtectedRoute>
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />

        {/* Bọc lót cho các đường dẫn không tồn tại */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
