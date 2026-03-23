const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// 1. CẤU HÌNH CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin.startsWith("http://localhost") || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. KẾT NỐI DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ GoFinance Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

// 3. ĐỊNH NGHĨA MODEL NGƯỜI DÙNG (Lưu mật khẩu thô)
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Lưu trực tiếp chuỗi văn bản
    fullName: String,
    dept: String,
    isLocked: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["admin", "manager", "nhân viên"], 
      default: "nhân viên",
    },
  }, { timestamps: true })
);

// 4. ROUTE ĐĂNG NHẬP (So sánh chuỗi trực tiếp)
app.post("/api/login", async (req, res) => {
  const { account, password } = req.body;

  try {
    // Tìm theo email HOẶC phone
    const user = await User.findOne({
      $or: [{ email: account }, { phone: account }]
    });

    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });
    }

    // Kiểm tra trạng thái khóa
    if (user.isLocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa!" });
    }

    // SO SÁNH MẬT KHẨU TRỰC TIẾP (KHÔNG DÙNG BCRYPT)
    if (user.password !== password) {
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ!" });
  }
});

// --- QUẢN LÝ NHÂN VIÊN ---

// Lấy danh sách
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thêm mới (Mật khẩu lưu thô)
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, phone, dept, role, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email hoặc Số điện thoại đã tồn tại!" });
    }

    const newUser = new User({
      fullName: name,
      email,
      phone,
      dept,
      role,
      password: password || "123456", // Lưu trực tiếp
      isLocked: false
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật
app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email, phone, dept, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName: name, email, phone, dept, role },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Lỗi cập nhật" });
  }
});

// Xóa
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa" });
  }
});

// Khóa/Mở khóa
app.patch("/api/users/toggle-lock/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy" });
    user.isLocked = !user.isLocked;
    await user.save();
    res.json({ message: "Thao tác thành công", isLocked: user.isLocked });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thao tác" });
  }
});

app.get("/ping", (req, res) => res.status(200).send("Server is alive!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));