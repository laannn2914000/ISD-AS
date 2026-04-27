import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, X, FileText } from "lucide-react";

const ReportDetailModal = ({ report, onClose }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Bao-cao-${report.reportId}`,
  });

  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
        {/* Header của Modal */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText size={20} />
            </div>
            <h3 className="font-bold text-gray-800">
              Chi tiết báo cáo: {report.reportId}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-100"
            >
              <Printer size={18} /> Xuất PDF / In
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Nội dung báo cáo - Phần này sẽ được in */}
        <div className="flex-1 overflow-y-auto p-12 bg-gray-100/30">
          <div
            ref={componentRef}
            className="bg-white shadow-sm mx-auto p-16 min-h-[1100px] w-[794px] text-black font-sans tracking-normal"
            style={{ color: "#000", letterSpacing: 0.2 }}
          >
            {/* Header văn bản hành chính */}
            <div className="flex justify-between mb-10 italic text-sm">
              <div className="text-center">
                <p className="font-bold uppercase">CÔNG TY KTBM</p>
                <p className="not-italic">Số: {report.reportId}</p>
              </div>
              <div className="text-center">
                <p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="font-bold underline decoration-1 underline-offset-4">
                  Độc lập - Tự do - Hạnh phúc
                </p>
              </div>
            </div>

            <div className="text-right mb-10 italic">
              Hà Nội, ngày {new Date(report.createdAt).getDate()} tháng{" "}
              {new Date(report.createdAt).getMonth() + 1} năm{" "}
              {new Date(report.createdAt).getFullYear()}
            </div>

            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase">{report.name}</h1>
              <p className="mt-2 text-lg italic">
                Loại báo cáo:{" "}
                {report.type === "finance"
                  ? "Báo cáo tài chính"
                  : report.type === "daily"
                    ? "Báo cáo hàng ngày"
                    : report.type === "business"
                      ? "Báo cáo kết quả kinh doanh"
                      : report.type}
              </p>
            </div>

            <div className="space-y-6 text-justify leading-relaxed">
              <p>
                <span className="font-bold">Kính gửi:</span>{" "}
                {report.content?.recipient || "Ban Giám đốc Công ty KTBM"}
              </p>

              <p>
                <span className="font-bold">Người báo cáo:</span>{" "}
                {report.content?.reporter || report.creatorName}
              </p>
              <p>
                <span className="font-bold">Bộ phận:</span>{" "}
                {report.content?.dept || report.dept}
              </p>

              {/* Hiển thị các trường nội dung mà nhân viên đã tạo */}
              {report.content && (
                <div className="mt-4">
                  <p className="font-bold mb-2 text-lg underline">
                    Nội dung báo cáo:
                  </p>
                  <div className="whitespace-pre-wrap pl-4 border-l-2 border-gray-200 py-2 space-y-3">
                    {/* Hiển thị tất cả các trường có trong content */}
                    {report.content.companyName && (
                      <div>
                        <span className="font-semibold">Tên công ty:</span>{" "}
                        {report.content.companyName}
                      </div>
                    )}
                    {report.content.reportNumber && (
                      <div>
                        <span className="font-semibold">Số:</span>{" "}
                        {report.content.reportNumber}
                      </div>
                    )}
                    {report.content.location && (
                      <div>
                        <span className="font-semibold">Địa điểm:</span>{" "}
                        {report.content.location}
                      </div>
                    )}
                    {report.content.title && (
                      <div>
                        <span className="font-semibold">Tiêu đề:</span>{" "}
                        {report.content.title}
                      </div>
                    )}
                    {report.content.income !== undefined &&
                      report.content.income !== 0 && (
                        <div>
                          <span className="font-semibold">Tổng thu:</span>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(report.content.income)}
                        </div>
                      )}
                    {report.content.expense !== undefined &&
                      report.content.expense !== 0 && (
                        <div>
                          <span className="font-semibold">Tổng chi:</span>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(report.content.expense)}
                        </div>
                      )}
                    {report.content.detail && (
                      <div>
                        <span className="font-semibold">Chi tiết:</span>{" "}
                        {report.content.detail}
                      </div>
                    )}
                    {report.content.done && (
                      <div>
                        <span className="font-semibold">
                          Công việc đã hoàn thành:
                        </span>{" "}
                        {report.content.done}
                      </div>
                    )}
                    {report.content.issues && (
                      <div>
                        <span className="font-semibold">Vấn đề gặp phải:</span>{" "}
                        {report.content.issues}
                      </div>
                    )}
                    {report.content.plan && (
                      <div>
                        <span className="font-semibold">
                          Kế hoạch tiếp theo:
                        </span>{" "}
                        {report.content.plan}
                      </div>
                    )}
                    {report.content.kpi !== undefined &&
                      report.content.kpi !== 0 && (
                        <div>
                          <span className="font-semibold">Chỉ tiêu KPI:</span>{" "}
                          {report.content.kpi}%
                        </div>
                      )}
                    {report.content.analysis && (
                      <div>
                        <span className="font-semibold">Phân tích:</span>{" "}
                        {report.content.analysis}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <p>
                  <span className="font-bold italic text-blue-600">
                    Trạng thái phê duyệt:
                  </span>{" "}
                  {report.status === "approved" || report.status === "Approved"
                    ? "Đã duyệt"
                    : report.status === "rejected" ||
                        report.status === "Rejected"
                      ? "Từ chối"
                      : "Chờ duyệt"}
                </p>
                {report.comment && (
                  <p className="mt-2 p-3 bg-red-50 border-l-4 border-red-400 italic text-red-700">
                    Ghi chú từ quản lý: {report.comment}
                  </p>
                )}
              </div>
            </div>

            {/* Chữ ký */}
            <div className="mt-20 grid grid-cols-2 text-center">
              <div>
                <p className="font-bold">Người lập báo cáo</p>
                <p className="italic text-xs text-gray-400">
                  (Ký và ghi rõ họ tên)
                </p>
                <div className="h-24"></div>
                <p className="font-bold">{report.creatorName}</p>
              </div>
              <div>
                <p className="font-bold">Cấp trên phê duyệt</p>
                <p className="italic text-xs text-gray-400">
                  (Xác nhận bằng chữ ký số)
                </p>
                <div className="h-24 flex items-center justify-center italic text-gray-300 border border-dashed border-gray-200 mx-10">
                  {report.status === "Approved" || report.status === "approved"
                    ? "ĐÃ PHÊ DUYỆT"
                    : "CHƯA PHÊ DUYỆT"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
