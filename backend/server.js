const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. KẾT NỐI DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ APMS Database Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// 2. MODEL USER (Thêm loginAttempts)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  dept: String,
  role: { type: String, enum: ["admin", "manager", "nhân viên"], default: "nhân viên" },
  isLocked: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 }, // Theo dõi số lần đăng nhập sai
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// 3. MIDDLEWARE
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không tìm thấy Token!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ!" });
    req.user = decoded;
    next();
  });
};

// 4. ROUTE ĐĂNG NHẬP (Xử lý đếm số lần sai và khóa tài khoản)
app.post("/api/login", async (req, res) => {
  const { account, password } = req.body;
  try {
    // Tài khoản Admin mặc định (Không áp dụng cơ chế khóa cho Admin hệ thống)
    if (account === "admin@system.com" && password === "Admin@123") {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "24h" });
      return res.json({ token, user: { fullName: "Hệ thống Admin", role: "admin", email: account } });
    }

    const user = await User.findOne({ $or: [{ email: account }, { phone: account }] });

    // Trường hợp không tìm thấy User
    if (!user) return res.status(400).json({ message: "Tài khoản hoặc mật khẩu không đúng!" });

    // Kiểm tra nếu tài khoản đang bị khóa
    if (user.isLocked) {
      return res.status(403).json({ 
        message: "Tài khoản đã bị khóa do nhập sai quá 5 lần. Vui lòng bấm 'Quên mật khẩu' để khôi phục!" 
      });
    }

    // Kiểm tra mật khẩu
    if (user.password !== password) {
      // Nếu không phải Admin, tăng số lần thử
      if (user.role !== "admin") {
        user.loginAttempts += 1;
        
        if (user.loginAttempts >= 5) {
          user.isLocked = true;
          await user.save();
          return res.status(403).json({ message: "Sai quá 5 lần. Tài khoản của bạn đã bị khóa!" });
        }
        
        await user.save();
        const remaining = 5 - user.loginAttempts;
        return res.status(400).json({ message: `Sai mật khẩu! Bạn còn ${remaining} lần thử.` });
      }
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    // Đăng nhập thành công -> Reset số lần thử về 0
    user.loginAttempts = 0;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role, email: user.email } });

  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// 5. API QUÊN MẬT KHẨU (Reset pass và Mở khóa)
app.post("/api/users/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Tìm user và cập nhật mật khẩu mới, reset loginAttempts và mở khóa
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại!" });

    user.password = newPassword;
    user.isLocked = false;
    user.loginAttempts = 0;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công và tài khoản đã được mở khóa!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi reset mật khẩu" });
  }
});

// --- CÁC API CÒN LẠI GIỮ NGUYÊN THIẾT KẾ CỦA BẠN ---

app.get("/api/users", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Quyền Admin!" });
  const managers = await User.find({ role: "manager" }).select("-password").sort({ createdAt: -1 });
  res.json(managers);
});

app.post("/api/users/register", verifyToken, async (req, res) => {
  try {
    const { fullName, email, phone, dept, password, role } = req.body;
    const newUser = new User({ fullName, email, phone, dept, password, role: role || "manager" });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) { res.status(400).json({ message: "Tài khoản (Email/SĐT) đã tồn tại!" }); }
});

app.get("/api/manager/employees", verifyToken, async (req, res) => {
  try {
    const employees = await User.find({ managedBy: req.user.id, role: "nhân viên" }).select("-password");
    res.json(employees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/manager/employees/register", verifyToken, async (req, res) => {
  try {
    const { fullName, email, phone, dept, password } = req.body;
    const newEmployee = new User({ fullName, email, phone, dept, password, role: "nhân viên", managedBy: req.user.id });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) { res.status(400).json({ message: "Nhân viên đã tồn tại!" }); }
});

app.put("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) { res.status(400).json({ message: "Lỗi cập nhật" }); }
});

app.patch("/api/users/toggle-lock/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isLocked = !user.isLocked;
    if (!user.isLocked) user.loginAttempts = 0; // Nếu Admin mở khóa thủ công, reset luôn số lần sai
    await user.save();
    res.json({ isLocked: user.isLocked });
  } catch (err) { res.status(400).json({ message: "Lỗi thao tác" }); }
});

app.delete("/api/users/:id", verifyToken, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xóa thành công" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));