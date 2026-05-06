const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// 1. TẠO BÁO CÁO MỚI (Dùng cho Employee)
router.post("/create", async (req, res) => {
  try {
    const { name, type, content, status, dept, creatorName } = req.body;

    // Tạo mã báo cáo tự động (VD: BC-1712345678)
    const newReportId = `BC-${Date.now()}`;

    const newReport = new Report({
      reportId: newReportId,
      name,
      type,
      content,
      status: status || "Submitted",
      creatorId: req.user.id,
      creatorName: creatorName || req.user.fullName,
      dept: dept || req.user.dept,
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lưu báo cáo" });
  }
});

// 2. LẤY Quản lý báo cáo (Dùng cho trang "Quản lý báo cáo")
router.get("/my-reports", async (req, res) => {
  try {
    const reports = await Report.find({ creatorId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu" });
  }
});

// 3. SEARCH & FILTER (Manager & Admin dùng để quản lý)
router.get("/search", async (req, res) => {
  try {
    const {
      search,
      reportId,
      creator,
      status,
      startDate,
      endDate,
      type,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(parseInt(limit, 10) || 10, 50));
    let query = {};

    // Phân quyền: Employee chỉ thấy bài mình, Manager & Admin thấy tất cả
    if (req.user.role === "nhân viên") {
      query.creatorId = req.user.id;
    }

    if (reportId) {
      query.reportId = reportId;
    } else {
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { creatorName: { $regex: search, $options: "i" } },
        ];
      }
      if (creator) query.creatorName = { $regex: creator, $options: "i" };
      if (status && status !== "All") query.status = status;
      if (type) query.type = type;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const totalCount = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      reports,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

// 4. DUYỆT HOẶC TỪ CHỐI (Dùng cho Manager/Admin)
router.patch("/:id/decide", async (req, res) => {
  try {
    const { action, comment } = req.body;

    if (req.user.role === "nhân viên") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền duyệt báo cáo" });
    }

    const report = await Report.findById(req.params.id);
    if (!report)
      return res.status(404).json({ message: "Báo cáo không tồn tại" });

    // Manager không thể duyệt báo cáo của chính mình
    if (
      req.user.role === "manager" &&
      report.creatorId.toString() === req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không thể duyệt báo cáo của chính mình" });
    }

    // Cập nhật trạng thái
    report.status = action === "Approve" ? "Approved" : "Rejected";
    if (comment) report.comment = comment;
    report.updatedAt = Date.now();

    await report.save();
    res.json({
      message: `Đã ${action === "Approve" ? "Duyệt" : "Từ chối"} báo cáo`,
      report,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xử lý báo cáo" });
  }
});

// 4b. LẤY CHI TIẾT BÁO CÁO
router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu" });
  }
});

// 4c. CẬP NHẬT BÁO CÁO (Chỉ chủ sở hữu sửa được báo cáo Draft hoặc Rejected của mình)
router.put("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Không tìm thấy" });

    // Chỉ chủ sở hữu mới được sửa
    if (report.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền sửa" });
    }

    // Chỉ sửa được khi là Draft hoặc Rejected
    if (!["Draft", "Rejected"].includes(report.status)) {
      return res
        .status(400)
        .json({ message: "Chỉ sửa được báo cáo nháp hoặc bị từ chối" });
    }

    const { name, type, content, status, dept, creatorName } = req.body;
    if (name) report.name = name;
    if (type) report.type = type;
    if (content) report.content = content;
    if (status) report.status = status;
    if (dept) report.dept = dept;
    if (creatorName) report.creatorName = creatorName;
    report.updatedAt = Date.now();

    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật báo cáo" });
  }
});

// 5. XÓA BÁO CÁO
router.delete("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Không tìm thấy" });

    const isOwner = report.creatorId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Không có quyền" });

    if (isOwner && report.status === "Approved") {
      return res
        .status(400)
        .json({ message: "Không thể xóa báo cáo đã được duyệt" });
    }

    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa báo cáo" });
  }
});

module.exports = router;
