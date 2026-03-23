import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  // THAY ĐỔI 1: Đổi tên state từ email -> account để khớp với Backend (const { account, password } = req.body)
  const [account, setAccount] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(""); 
  const navigate = useNavigate();

  const [view, setView] = useState("login");
  
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    let interval;
    if (view === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      // THAY ĐỔI 2: Gửi trường 'account' thay vì 'email'
      const response = await axios.post(`${API_URL}/api/login`, { account, password });
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      // Hiển thị lỗi từ server trả về (ví dụ: "Tài khoản bị khóa" hoặc "Sai mật khẩu")
      setLoginError(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!forgotEmail.includes("@")) {
      setResetError("Email không tồn tại trong hệ thống!");
      return;
    }
    setTimer(30);
    setResetError("");
    setView("otp");
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (timer === 0) {
      setResetError("Mã OTP đã hết hạn. Vui lòng gửi lại!");
      return;
    }
    if (otp === "123456") {
      setResetError("");
      setView("reset");
    } else {
      setResetError("Mã OTP không chính xác. Vui lòng kiểm tra lại!");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError("Mật khẩu xác nhận không khớp!");
      return;
    }
    alert("Thay đổi mật khẩu thành công! Hãy đăng nhập lại.");
    setView("login");
    setResetError("");
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* CỘT TRÁI: BANNER - GIỮ NGUYÊN THIẾT KẾ CỦA BẠN */}
      <div className="hidden lg:flex flex-col justify-center w-[60%] bg-gradient-to-tr from-[#0052cc] via-[#0061f2] to-[#0074e4] p-32 text-white relative text-left">
        <div className="z-10 -mt-20">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">Kế Toán Bách Mỹ</h1>
          <p className="text-xl opacity-90 font-light mb-10 max-w-md leading-relaxed">
            Hệ thống quản lý quy trình kế toán nội bộ và quản lý tài chính
          </p>
          <button className="bg-[#1a8cff] hover:bg-white hover:text-[#0061f2] border border-white/20 px-10 py-3 rounded-full transition-all text-sm font-semibold shadow-lg w-fit active:scale-95 text-left">
            Đọc Thêm
          </button>
        </div>
        <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] border border-white/25 rounded-full"></div>
        <div className="absolute -bottom-48 -left-10 w-[500px] h-[500px] border border-white/20 rounded-full"></div>
      </div>

      {/* CỘT PHẢI: FORM - GIỮ NGUYÊN THIẾT KẾ CỦA BẠN */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center px-16 lg:px-24 text-left">
        <div className="w-full max-w-sm">
          
          {/* 1. ĐĂNG NHẬP */}
          {view === "login" && (
            <>
              <div className="mb-14">
                <h2 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">Đăng Nhập</h2>
                <p className="text-gray-400 text-lg font-medium opacity-80">Nhập thông tin tài khoản để truy cập hệ thống</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Email/Số điện thoại" 
                    className="w-full px-8 py-4.5 border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] outline-none focus:ring-1 focus:ring-[#0061f2] text-gray-700" 
                    value={account} // Liên kết với state account
                    onChange={(e) => setAccount(e.target.value)} 
                    required 
                  />
                </div>

                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Mật khẩu" 
                    className="w-full px-8 py-4.5 border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] outline-none focus:ring-1 focus:ring-[#0061f2] text-gray-700" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {loginError && <p className="text-red-500 text-sm font-bold ml-4">{loginError}</p>}

                <button disabled={loading} className="w-full bg-[#0061f2] hover:bg-[#0052cc] text-white py-4.5 rounded-full font-bold text-lg shadow-lg flex justify-center items-center active:scale-95 disabled:opacity-70">
                  {loading ? <Loader2 className="animate-spin" /> : "Đăng Nhập"}
                </button>
              </form>

              <div className="mt-10 text-center">
                <button onClick={() => setView("forgot")} className="text-gray-400 hover:text-[#0061f2] text-sm font-semibold underline underline-offset-8 decoration-gray-200">
                  Quên mật khẩu
                </button>
              </div>
            </>
          )}

          {/* CÁC PHẦN FORGOT, OTP, RESET (GIỮ NGUYÊN) */}
          {view === "forgot" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">Nhập Email hoặc Số điện thoại để nhận mã xác thực OTP.</p>
              <form onSubmit={handleSendOTP} className="space-y-6">
                <input type="text" placeholder="Email/Số điện thoại" className="w-full px-8 py-4.5 border border-gray-100 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2]" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                {resetError && <p className="text-red-500 text-sm font-bold ml-4">{resetError}</p>}
                <button className="w-full bg-[#0061f2] text-white py-4.5 rounded-full font-bold shadow-lg">Gửi mã xác nhận</button>
                <div className="text-center">
                  <button type="button" onClick={() => {setView("login"); setResetError("");}} className="text-gray-400 text-sm font-bold">Quay lại đăng nhập</button>
                </div>
              </form>
            </div>
          )}

          {view === "otp" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Xác thực OTP</h2>
              <p className="text-gray-400 mb-8 leading-relaxed italic">Hiệu lực mã xác thực còn: <span className="text-[#0061f2] font-bold">{timer}s</span></p>
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <input type="text" maxLength={6} placeholder="Nhập mã OTP (123456)" className="w-full px-8 py-4.5 border border-gray-100 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2]" onChange={(e) => setOtp(e.target.value)} required />
                {resetError && <p className="text-red-500 text-sm font-bold ml-4">{resetError}</p>}
                <button disabled={timer === 0} className="w-full bg-[#0061f2] text-white py-4.5 rounded-full font-bold shadow-lg disabled:bg-gray-200">Xác nhận mã</button>
                <div className="text-center">
                  <button type="button" onClick={() => {setTimer(30); setResetError("");}} className="text-[#0061f2] text-sm font-bold">Gửi lại mã</button>
                </div>
              </form>
            </div>
          )}

          {view === "reset" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Mật khẩu mới</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">Vui lòng thiết lập lại mật khẩu mới cho tài khoản.</p>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <input type="password" placeholder="Mật khẩu mới" className="w-full px-8 py-4.5 border border-gray-100 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2]" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <input type="password" placeholder="Xác nhận mật khẩu" className="w-full px-8 py-4.5 border border-gray-100 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                {resetError && <p className="text-red-500 text-sm font-bold ml-4">{resetError}</p>}
                <button className="w-full bg-[#0061f2] text-white py-4.5 rounded-full font-bold shadow-lg">Lưu mật khẩu mới</button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;