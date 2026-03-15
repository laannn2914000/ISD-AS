import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      <div className="hidden lg:flex flex-col justify-center w-[60%] bg-gradient-to-tr from-[#0052cc] via-[#0061f2] to-[#0074e4] p-32 text-white relative">
        <div className="z-10 -mt-20">
          {" "}
          <h1 className="text-6xl font-bold mb-4 tracking-tight">
            Kế Toán Bách Mỹ
          </h1>
          <p className="text-x opacity-90 font-light mb-10 max-w-md leading-relaxed">
            Hệ thống quản lý quy trình kế toán nội bộ và quản lý tài chính
          </p>
          <button className="bg-[#1a8cff] hover:bg-blue-400 border border-white/20 px-10 py-3 rounded-full transition-all text-sm font-semibold shadow-lg w-fit">
            Đọc Thêm
          </button>
        </div>

        <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] border border-white/20 rounded-full"></div>
        <div className="absolute -bottom-48 -left-10 w-[500px] h-[500px] border border-white/18 rounded-full"></div>
      </div>

      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center px-16 lg:px-24">
        <div className="w-full max-w-sm">
          <div className="mb-14">
            <h2 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">
              Đăng Nhập
            </h2>
            <p className="text-gray-400 text-lg font-medium opacity-80">
              Nhập thông tin tài khoản để truy cập hệ thống
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0061f2] transition-colors"
                size={20}
              />
              <input
                type="email"
                placeholder="Email/Số điện thoại"
                className="w-full pl-16 pr-6 py-4.5 border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] outline-none focus:ring-1 focus:ring-[#0061f2] transition-all text-gray-700 placeholder:text-gray-300"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0061f2] transition-colors"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="w-full pl-16 pr-14 py-4.5 border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] outline-none focus:ring-1 focus:ring-[#0061f2] transition-all text-gray-700 placeholder:text-gray-300"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#0061f2] hover:bg-[#0052cc] text-white py-4.5 rounded-full font-bold text-lg shadow-[0_10px_25px_rgba(0,97,242,0.2)] transition-all flex justify-center items-center active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Đăng Nhập"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button className="text-gray-400 hover:text-[#0061f2] text-sm font-semibold underline underline-offset-8 decoration-gray-200 hover:decoration-[#0061f2] transition-all">
              Quên mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
