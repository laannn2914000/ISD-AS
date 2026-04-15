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
            <h3 className="font-bold text-gray-800">Chi tiết báo cáo: {report.reportId}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-100"
            >
              <Printer size={18} /> Xuất PDF / In
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Nội dung báo cáo - Phần này sẽ được in */}
        <div className="flex-1 overflow-y-auto p-12 bg-gray-100/30">
          <div 
            ref={componentRef} 
            className="bg-white shadow-sm mx-auto p-16 min-h-[1100px] w-[794px] text-black font-serif"
            style={{ color: '#000' }}
          >
            {/* Header văn bản hành chính */}
            <div className="flex justify-between mb-10 italic text-sm">
              <div className="text-center">
                <p className="font-bold uppercase">CÔNG TY KTBM</p>
                <p className="not-italic">Số: {report.reportId}</p>
              </div>
              <div className="text-center">
                <p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="font-bold underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</p>
              </div>
            </div>

            <div className="text-right mb-10 italic">
              Hà Nội, ngày {new Date(report.createdAt).getDate()} tháng {new Date(report.createdAt).getMonth() + 1} năm {new Date(report.createdAt).getFullYear()}
            </div>

            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase">{report.name}</h1>
              <p className="mt-2 text-lg italic">Loại báo cáo: {report.type}</p>
            </div>

            <div className="space-y-6 text-justify leading-relaxed">
              <p><span className="font-bold">Kính gửi:</span> Ban Giám đốc Công ty KTBM</p>
              
              <p><span className="font-bold">Người báo cáo:</span> {report.creatorName}</p>
              <p><span className="font-bold">Bộ phận:</span> {report.dept}</p>
              
              <div className="mt-4">
                <p className="font-bold mb-2 text-lg underline">Nội dung báo cáo:</p>
                <div className="whitespace-pre-wrap pl-4 border-l-2 border-gray-200 py-2">
                  {/* Nếu content là Object thì render từng field, nếu là chuỗi thì render trực tiếp */}
                  {typeof report.content === 'object' ? (
                    Object.entries(report.content).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <span className="font-semibold capitalize">{key}:</span> {value}
                      </div>
                    ))
                  ) : (
                    report.content
                  )}
                </div>
              </div>

              <div className="mt-8">
                <p><span className="font-bold italic text-blue-600">Trạng thái phê duyệt:</span> {report.status}</p>
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
                <p className="italic text-xs text-gray-400">(Ký và ghi rõ họ tên)</p>
                <div className="h-24"></div>
                <p className="font-bold">{report.creatorName}</p>
              </div>
              <div>
                <p className="font-bold">Cấp trên phê duyệt</p>
                <p className="italic text-xs text-gray-400">(Xác nhận bằng chữ ký số)</p>
                <div className="h-24 flex items-center justify-center italic text-gray-300 border border-dashed border-gray-200 mx-10">
                  {report.status === 'Approved' ? 'ĐÃ PHÊ DUYỆT' : 'CHƯA PHÊ DUYỆT'}
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