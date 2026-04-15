const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportId: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // Tiêu đề báo cáo
    type: { type: String, enum: ['finance', 'daily', 'business'], required: true },
    content: { type: Object, required: true }, // Lưu toàn bộ thông tin hành chính & nội dung sửa đổi
    status: { 
        type: String, 
        enum: ['Draft', 'Submitted', 'Approved', 'Rejected'], 
        default: 'Draft' 
    },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creatorName: String,
    dept: String,
    comment: String, // Phản hồi của Manager/Admin
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Report', reportSchema);