const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// 1. CẤU HÌNH CORS CHI TIẾT
const corsOptions = {
  origin: [
    "http://localhost:5173", // URL mặc định của Vite
    "isd-as.vercel.app", // THAY THẾ bằng URL Vercel thật của bạn
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. KẾT NỐI DATABASE (Dùng MongoDB Atlas cho thực tế)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ GoFinance Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

// 3. ĐỊNH NGHĨA MODEL NGƯỜI DÙNG
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    role: {
      type: String,
      enum: ["admin", "quản lý", "nhân viên"],
      default: "nhân viên",
    },
  }),
);

// 4. ROUTE ĐĂNG NHẬP
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng theo Email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // So sánh mật khẩu băm (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Trả về dữ liệu thành công
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        fullName: user.fullName,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập hệ thống:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ! Vui lòng thử lại sau." });
  }
});

// 5. ROUTE KIỂM TRA TRẠNG THÁI SERVER (Dùng để Render không bị tắt)
app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive!");
});

// 6. KHỞI CHẠY SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GoFinance Server is running on port ${PORT}`);
});
