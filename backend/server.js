const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const reportRoutes = require("./routes/reportRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. KẾT NỐI DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ APMS Database Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// 2. MODEL USER
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    dept: String,
    role: {
      type: String,
      enum: ["admin", "manager", "nhân viên"],
      default: "nhân viên",
    },
    isLocked: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

// 3. MIDDLEWARE (Đã di chuyển lên đây để sửa lỗi ReferenceError)
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không tìm thấy Token!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ!" });
    req.user = decoded;
    next();
  });
};

// --- TÍCH HỢP ROUTE REPORT TẠI ĐÂY ---
app.use("/api/reports", verifyToken, reportRoutes);

// 13. API TÌM KIẾM BÁO CÁO CHO ADMIN, MANAGER, EMPLOYEE (Đặt sau reportRoutes)
const Report = require("./models/Report");
app.get("/api/reports/search", verifyToken, async (req, res) => {
  try {
    const { name = "", status = "", type = "", creator = "" } = req.query;
    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (creator) filter.creatorId = creator;

    // Nếu là employee chỉ cho xem báo cáo của mình
    if (req.user.role === "nhân viên") {
      filter.creatorId = req.user.id;
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tìm kiếm báo cáo" });
  }
});

// 4. ROUTE ĐĂNG NHẬP
app.post("/api/login", async (req, res) => {
  const { account, password } = req.body;
  try {
    if (account === "admin@system.com" && password === "Admin@123") {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      return res.json({
        token,
        user: { fullName: "Hệ thống Admin", role: "admin", email: account },
      });
    }

    const user = await User.findOne({
      $or: [{ email: account }, { phone: account }],
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng!" });

    if (user.isLocked) {
      return res.status(403).json({
        message:
          "Tài khoản đã bị khóa do nhập sai quá 5 lần. Vui lòng bấm 'Quên mật khẩu' để khôi phục!",
      });
    }

    if (user.password !== password) {
      if (user.role !== "admin") {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
          user.isLocked = true;
          await user.save();
          return res
            .status(403)
            .json({ message: "Sai quá 5 lần. Tài khoản của bạn đã bị khóa!" });
        }
        await user.save();
        const remaining = 5 - user.loginAttempts;
        return res
          .status(400)
          .json({ message: `Sai mật khẩu! Bạn còn ${remaining} lần thử.` });
      }
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    user.loginAttempts = 0;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ hệ thống" });
  }
});

// 5. API QUÊN MẬT KHẨU
app.post("/api/users/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại!" });

    user.password = newPassword;
    user.isLocked = false;
    user.loginAttempts = 0;
    await user.save();
    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi reset mật khẩu" });
  }
});

// --- CÁC ROUTE QUẢN LÝ (SẮP XẾP LẠI ĐỂ TRÁNH LỖI 404) ---

// 6. ROUTE THỐNG KÊ (Sửa lỗi 404 /api/manager/stats)
app.get("/api/manager/stats", verifyToken, async (req, res) => {
  try {
    const total = await User.countDocuments({
      managedBy: req.user.id,
      role: "nhân viên",
    });
    const locked = await User.countDocuments({
      managedBy: req.user.id,
      role: "nhân viên",
      isLocked: true,
    });

    // Thống kê báo cáo
    const pendingReports = await Report.countDocuments({ status: "Submitted" });
    const approvedReports = await Report.countDocuments({ status: "Approved" });
    const rejectedReports = await Report.countDocuments({ status: "Rejected" });

    res.json({
      totalEmployees: total,
      lockedEmployees: locked,
      activeEmployees: total - locked,
      pendingReports,
      approvedReports,
      rejectedReports,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi thống kê" });
  }
});

// 6b. ROUTE THỐNG KÊ CHO ADMIN
// API thống kê cho admin (chuẩn hóa, có thể mở rộng thêm các trường khác nếu cần)
app.get("/api/dashboard-stats", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Quyền Admin!" });

    const [
      totalManagers,
      totalEmployees,
      lockedUsers,
      pendingReports,
      approvedReports,
      rejectedReports,
      totalReports,
    ] = await Promise.all([
      User.countDocuments({ role: "manager" }),
      User.countDocuments({ role: "nhân viên" }),
      User.countDocuments({ isLocked: true }),
      Report.countDocuments({ status: "Submitted" }),
      Report.countDocuments({ status: "Approved" }),
      Report.countDocuments({ status: "Rejected" }),
      Report.countDocuments(),
    ]);

    res.json({
      totalManagers,
      totalEmployees,
      lockedUsers,
      pendingReports,
      approvedReports,
      rejectedReports,
      totalReports,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi thống kê" });
  }
});

// 7. ROUTE KHÓA/MỞ KHÓA (ƯU TIÊN LÊN TRƯỚC CÁC ROUTE CÓ :id NGẮN)
app.patch(
  "/api/manager/employees/toggle-lock/:id",
  verifyToken,
  async (req, res) => {
    console.log("==> Request LOCK cho ID:", req.params.id);
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy nhân viên" });

      user.isLocked = !user.isLocked;
      if (!user.isLocked) user.loginAttempts = 0;
      await user.save();

      console.log("==> Trạng thái mới:", user.isLocked);
      res.json({ isLocked: user.isLocked });
    } catch (err) {
      console.error("Lỗi Toggle Lock:", err);
      res.status(400).json({ message: "Lỗi thao tác" });
    }
  },
);

// 8. LẤY DANH SÁCH NHÂN VIÊN
app.get("/api/manager/employees", verifyToken, async (req, res) => {
  try {
    const employees = await User.find({
      managedBy: req.user.id,
      role: "nhân viên",
    })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 9. CÁC ROUTE CỦA ADMIN & CHUNG (CÓ CHỨA THAM SỐ :id ĐẶT DƯỚI CÙNG)
app.get("/api/users", verifyToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Quyền Admin!" });
  const managers = await User.find({ role: "manager" })
    .select("-password")
    .sort({ createdAt: -1 });
  res.json(managers);
});

app.post("/api/users/register", verifyToken, async (req, res) => {
  try {
    const { fullName, email, phone, dept, password, role } = req.body;
    const newUser = new User({
      fullName,
      email,
      phone,
      dept,
      password,
      role: role || "manager",
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: "Tài khoản đã tồn tại!" });
  }
});

app.post("/api/manager/employees/register", verifyToken, async (req, res) => {
  try {
    const { fullName, email, phone, dept, password } = req.body;
    const newEmployee = new User({
      fullName,
      email,
      phone,
      dept,
      password,
      role: "nhân viên",
      managedBy: req.user.id,
    });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: "Nhân viên đã tồn tại!" });
  }
});

app.put("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Lỗi cập nhật" });
  }
});

app.delete("/api/users/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi xóa" });
  }
});

// 10. LẤY THÔNG TIN USER HIỆN TẠI
app.get("/api/users/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu" });
  }
});

// 11. THỐNG KÊ CHO EMPLOYEE
app.get("/api/employee-stats/:email", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const totalMyDocs = await Report.countDocuments({ creatorId: user._id });
    const approvedDocs = await Report.countDocuments({
      creatorId: user._id,
      status: "Approved",
    });
    const pendingDocs = await Report.countDocuments({
      creatorId: user._id,
      status: "Submitted",
    });
    const rejectedDocs = await Report.countDocuments({
      creatorId: user._id,
      status: "Rejected",
    });
    const draftDocs = await Report.countDocuments({
      creatorId: user._id,
      status: "Draft",
    });

    const recentReports = await Report.find({ creatorId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("reportId name status createdAt");

    res.json({
      stats: {
        totalMyDocs,
        approvedDocs,
        pendingDocs,
        rejectedDocs,
        draftDocs,
      },
      recentReports: recentReports.map((r) => ({
        docId: r.reportId,
        name: r.name,
        status:
          r.status === "Approved"
            ? "Đã duyệt"
            : r.status === "Rejected"
              ? "Từ chối"
              : r.status === "Draft"
                ? "Nháp"
                : "Chờ duyệt",
        date: new Date(r.createdAt).toLocaleDateString("vi-VN"),
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi thống kê" });
  }
});

// 11. CẬP NHẬT THÔNG TIN USER
app.put("/api/users/profile", verifyToken, async (req, res) => {
  try {
    const { fullName, phone, dept } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phone, dept },
      { new: true },
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 12. LẤY DANH SÁCH BÁO CÁO CHỜ DUYỆT VÀ HOẠT ĐỘNG GẦN ĐÂY CHO MANAGER

// Lấy danh sách báo cáo chờ duyệt (status: Submitted)
app.get("/api/manager/pending-reports", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "manager")
      return res.status(403).json({ message: "Chỉ dành cho manager" });
    const reports = await Report.find({ status: "Submitted" })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("reportId name creatorName createdAt");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy báo cáo chờ duyệt" });
  }
});

// Lấy hoạt động báo cáo gần đây (mọi trạng thái)
app.get("/api/manager/recent-activities", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "manager")
      return res.status(403).json({ message: "Chỉ dành cho manager" });
    const reports = await Report.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select("reportId name status creatorName createdAt");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy hoạt động gần đây" });
  }
});
