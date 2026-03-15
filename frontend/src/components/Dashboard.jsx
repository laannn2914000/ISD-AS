import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Kế toán Bách Mỹ
            </h1>
            <p className="text-gray-500">
              Xin chào,{" "}
              <span className="font-semibold text-blue-600">
                {user?.fullName}
              </span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-100 transition-all"
          >
            Đăng xuất
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-2xl">
            <p className="text-blue-600 font-medium">Chức vụ của bạn</p>
            <h2 className="text-2xl font-bold uppercase">{user?.role}</h2>
          </div>

          <div className="md:col-span-2 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
            Khu vực hiển thị nội dung theo chức vụ sẽ nằm ở đây
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
