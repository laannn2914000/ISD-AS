const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Thanh toán", "Tạm ứng hoàn ứng", "Báo cáo nội bộ"],
      default: "Thanh toán",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["Chờ duyệt", "Đã duyệt", "Đã từ chối"],
      default: "Chờ duyệt",
    },
    icSummary: { type: String, default: "" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", reportSchema);
