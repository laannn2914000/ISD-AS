const validateReport = (req, res, next) => {
  const { title, type, amount, content } = req.body;
  const allowedTypes = ["Thanh toán", "Tạm ứng hoàn ứng", "Báo cáo nội bộ"];
  const errors = [];

  if (!title || title.trim().length === 0)
    errors.push("Tiêu đề không được để trống.");
  if (!allowedTypes.includes(type)) errors.push("Loại báo cáo không hợp lệ.");
  if (amount === undefined || amount === null || Number(amount) < 0) {
    errors.push("Số tiền phải lớn hơn hoặc bằng 0.");
  }
  if (!content || content.trim().length === 0)
    errors.push("Nội dung báo cáo không được để trống.");

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  next();
};

module.exports = { validateReport };
