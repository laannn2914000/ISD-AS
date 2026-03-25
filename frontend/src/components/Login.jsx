import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
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
  const passRegex = /^[A-Z].*(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;

  useEffect(() => {
    let interval;
    if (view === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  // LOGIC CẬP NHẬT TẠI ĐÂY
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    // Kiểm tra bỏ trống
    if (!account.trim() || !password.trim()) {
      setLoginError("Vui lòng điền đầy đủ thông tin vào đây!");
      return; // Dừng lại không gọi API
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/login`, { account, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setLoginError(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetError("");
    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, { email: forgotEmail });
      setTimer(30);
      setView("otp");
    } catch (err) {
      setResetError(err.response?.data?.message || "Email không tồn tại trong hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (timer === 0) {
      setResetError("Mã OTP đã hết hạn. Vui lòng gửi lại!");
      return;
    }
    try {
      if (otp === "123456") {
        setResetError("");
        setView("reset");
      } else {
        setResetError("Mã OTP không chính xác!");
      }
    } catch (err) {
      setResetError("Lỗi xác thực!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    if (!passRegex.test(newPassword)) {
      setResetError("Mật khẩu phải > 5 ký tự, chữ đầu viết hoa và có ít nhất 1 ký tự đặc biệt!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/reset-password`, { 
        email: forgotEmail, 
        newPassword: newPassword 
      });
      alert("Thay đổi mật khẩu thành công! Tài khoản đã được mở khóa. Hãy đăng nhập lại.");
      setView("login");
      setAccount(forgotEmail);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setResetError(err.response?.data?.message || "Không thể đặt lại mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden text-left">
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

      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center px-16 lg:px-24">
        <div className="w-full max-w-sm">
          
          {view === "login" && (
            <>
              <div className="mb-14">
                <h2 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">Đăng Nhập</h2>
                <p className="text-gray-400 text-lg font-medium opacity-80">Nhập thông tin tài khoản để truy cập hệ thống</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <input 
                    type="text" 
                    placeholder="Email/Số điện thoại" 
                    className={`w-full px-8 py-4.5 border rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] outline-none focus:ring-1 focus:ring-[#0061f2] text-gray-700 ${loginError.includes("thông tin") && !account ? "border-red-400" : "border-gray-100"}`}
                    value={account} 
                    onChange={(e) => {
                        setAccount(e.target.value);
                        if(loginError) setLoginError("");
                    }} 
                  />
                </div>

                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Mật khẩu" 
                    className={`w-full px-8 py-4.5 border rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] outline-none focus:ring-1 focus:ring-[#0061f2] text-gray-700 ${loginError.includes("thông tin") && !password ? "border-red-400" : "border-gray-100"}`}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if(loginError) setLoginError("");
                    }} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {loginError && <p className="text-red-500 text-sm font-bold ml-4 leading-tight">{loginError}</p>}

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

          {/* ... Các phần FORGOT, OTP, RESET GIỮ NGUYÊN ... */}
          {view === "forgot" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">Nhập Email để nhận mã OTP và mở khóa tài khóa của bạn.</p>
              <form onSubmit={handleSendOTP} className="space-y-6">
                <input type="email" placeholder="Email nhận mã" className="w-full px-8 py-4.5 border border-gray-100 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2]" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                {resetError && <p className="text-red-500 text-sm font-bold ml-4">{resetError}</p>}
                <button disabled={loading} className="w-full bg-[#0061f2] text-white py-4.5 rounded-full font-bold shadow-lg flex justify-center">
                   {loading ? <Loader2 className="animate-spin" /> : "Gửi mã xác nhận"}
                </button>
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
              <p className="text-gray-400 mb-6 leading-relaxed">Thiết lập lại mật khẩu để mở khóa tài khoản.</p>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[12px] text-gray-500">
                <p className="font-bold text-[#0061f2] mb-1 uppercase">Yêu cầu mật khẩu:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Chữ cái đầu tiên phải <b>Viết hoa</b>.</li>
                  <li>Độ dài tối thiểu <b>6 ký tự</b>.</li>
                  <li>Phải chứa ít nhất <b>1 ký tự đặc biệt</b> (vd: @, #, $, !...).</li>
                </ul>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <input type="password" placeholder="Mật khẩu mới" className="w-full px-8 py-4.5 border border-gray-100 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2]" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <input type="password" placeholder="Xác nhận mật khẩu" className="w-full px-8 py-4.5 border border-gray-100 rounded-full outline-none focus:ring-1 focus:ring-[#0061f2]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                
                {resetError && <p className="text-red-500 text-[13px] font-bold ml-4 leading-tight">{resetError}</p>}
                
                <button disabled={loading} className="w-full bg-[#0061f2] text-white py-4.5 rounded-full font-bold shadow-lg flex justify-center active:scale-95">
                  {loading ? <Loader2 className="animate-spin" /> : "Lưu mật khẩu & Mở khóa"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;