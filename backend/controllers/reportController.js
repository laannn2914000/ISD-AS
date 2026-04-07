const Report = require("../models/reportModel");

const getReports = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim() || "";
    const filter = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { content: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const reports = await Report.find(filter)
      .populate("author", "fullName email role")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách báo cáo." });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "author",
      "fullName email role",
    );
    if (!report)
      return res.status(404).json({ message: "Không tìm thấy báo cáo." });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết báo cáo." });
  }
};

const createReport = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin không thể tạo báo cáo." });
    }

    const newReport = new Report({
      title: req.body.title,
      type: req.body.type,
      amount: req.body.amount,
      content: req.body.content,
      author: req.user.id,
    });

    await newReport.save();
    const populated = await newReport.populate("author", "fullName email role");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo báo cáo." });
  }
};

const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report)
      return res.status(404).json({ message: "Không tìm thấy báo cáo." });

    const isAuthor = report.author?.toString() === req.user.id;
    const canEdit =
      isAuthor || req.user.role === "manager" || req.user.role === "admin";
    if (!canEdit)
      return res
        .status(403)
        .json({ message: "Không có quyền sửa báo cáo này." });

    report.title = req.body.title;
    report.type = req.body.type;
    report.amount = req.body.amount;
    report.content = req.body.content;
    await report.save();
    const populated = await report.populate("author", "fullName email role");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật báo cáo." });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report)
      return res.status(404).json({ message: "Không tìm thấy báo cáo." });

    const isAuthor = report.author?.toString() === req.user.id;
    const canDelete =
      isAuthor || req.user.role === "manager" || req.user.role === "admin";
    if (!canDelete)
      return res
        .status(403)
        .json({ message: "Không có quyền xóa báo cáo này." });

    await report.deleteOne();
    res.json({ message: "Đã xóa báo cáo." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa báo cáo." });
  }
};

const approveReport = async (req, res) => {
  try {
    const { status, icSummary } = req.body;
    if (!["Đã duyệt", "Đã từ chối"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const report = await Report.findById(req.params.id);
    if (!report)
      return res.status(404).json({ message: "Không tìm thấy báo cáo." });

    report.status = status;
    report.icSummary = icSummary || report.icSummary;
    await report.save();
    const populated = await report.populate("author", "fullName email role");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi duyệt báo cáo." });
  }
};

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  approveReport,
};
