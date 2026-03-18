const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// 1. CẤU HÌNH CORS CHI TIẾT
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép localhost hoặc bất kỳ domain nào của vercel.app từ tài khoản của bạn
    if (
      !origin ||
      origin.startsWith("http://localhost") ||
      origin.includes("vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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

// 1. Định nghĩa Schema cho Chứng từ
const Document = mongoose.model(
  "Document",
  new mongoose.Schema({
    docId: String,
    department: String,
    creator: String,
    status: String,
    createdAt: { type: Date, default: Date.now },
  }),
);

// 2. Định nghĩa Schema cho Phê duyệt
const Approval = mongoose.model(
  "Approval",
  new mongoose.Schema({
    name: String,
    department: String,
    amount: String,
    sender: String,
  }),
);

// 3. Route lấy dữ liệu tổng hợp cho Dashboard
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 }).limit(5);
    const approvals = await Approval.find();

    // Gửi dữ liệu về Frontend
    res.json({
      recentDocuments: docs,
      approvalRequests: approvals,
      stats: {
        totalDocs: 1245, // Bạn có thể dùng Document.countDocuments()
        pendingReports: 18,
        receivable: "485M",
        payable: "298M",
      },
    });
  } catch (error) {
    res.status(500).send("Lỗi lấy dữ liệu dashboard");
  }
});

// Route lấy thống kê dành riêng cho nhân viên
app.get("/api/employee-stats/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const myDocs = await Document.find({ creatorEmail: email })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      recentReports: myDocs,
      stats: {
        totalMyDocs: await Document.countDocuments({ creatorEmail: email }),
        approvedDocs: await Document.countDocuments({
          creatorEmail: email,
          status: "Đã duyệt",
        }),
        pendingDocs: await Document.countDocuments({
          creatorEmail: email,
          status: "Chờ duyệt",
        }),
        rejectedDocs: await Document.countDocuments({
          creatorEmail: email,
          status: "Từ chối",
        }),
      },
    });
  } catch (error) {
    res.status(500).send("Lỗi lấy dữ liệu nhân viên");
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
