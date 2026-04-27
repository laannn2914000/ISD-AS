import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import axios from "axios";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  History,
  User,
  LogOut,
  ArrowLeft,
  Save,
  Printer,
  Send,
  FileSpreadsheet,
  CalendarDays,
  TrendingUp,
  Loader2,
} from "lucide-react";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef();

  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const [saving, setSaving] = useState(false);

  // Lấy user từ local để mặc định thông tin
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Nguyễn Tiến Hoàng Lân",
    role: "Nhân viên",
    dept: "Phòng Kế toán",
  };

  // State formData chứa tất cả thông tin hành chính để chỉnh sửa
  const [formData, setFormData] = useState({
    companyName: "CÔNG TY CỔ PHẦN KẾ TOÁN BÁCH MỸ",
    reportNumber: "......./BC-AX",
    location: "Hà Nội",
    recipient: "Ban Giám đốc Công ty Cổ phần Kế toán Bách Mỹ",
    reporter: user.fullName,
    dept: user.dept || "Phòng Kế toán",
    title: "",
    // Dữ liệu chuyên môn
    income: 0,
    expense: 0,
    detail: "",
    done: "",
    issues: "",
    plan: "",
    kpi: 0,
    analysis: "",
  });

  const templates = [
    {
      id: "finance",
      name: "Báo cáo tài chính",
      icon: <FileSpreadsheet size={32} className="text-blue-500" />,
      desc: "Kê khai chi tiêu, doanh thu và dòng tiền trong kỳ.",
    },
    {
      id: "daily",
      name: "Báo cáo hàng ngày",
      icon: <CalendarDays size={32} className="text-orange-500" />,
      desc: "Cập nhật tiến độ công việc và kế hoạch ngày tiếp theo.",
    },
    {
      id: "business",
      name: "Báo cáo kết quả kinh doanh",
      icon: <TrendingUp size={32} className="text-green-500" />,
      desc: "Phân tích doanh số, chỉ tiêu KPI và hiệu quả dự án.",
    },
  ];

  // Load báo cáo cần sửa
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const report = res.data;

        // Chỉ cho phép sửa báo cáo Draft
        if (report.status !== "Draft") {
          alert("Chỉ có thể sửa báo cáo ở trạng thái nháp!");
          navigate("/employee-reports");
          return;
        }

        setFormData({
          companyName: report.content?.companyName || "",
          reportNumber: report.content?.reportNumber || "",
          location: report.content?.location || "",
          recipient: report.content?.recipient || "",
          reporter: report.content?.reporter || user.fullName,
          dept: report.content?.dept || user.dept,
          title: report.name || "",
          income: report.content?.income || 0,
          expense: report.content?.expense || 0,
          detail: report.content?.detail || "",
          done: report.content?.done || "",
          issues: report.content?.issues || "",
          plan: report.content?.plan || "",
          kpi: report.content?.kpi || 0,
          analysis: report.content?.analysis || "",
        });
        setTemplate(report.type);
      } catch (err) {
        console.error("Lỗi tải báo cáo:", err);
        alert("Không thể tải báo cáo!");
        navigate("/employee-reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // CẬP NHẬT: Hàm gửi dữ liệu lên Backend
  const handleSubmitReport = async (status = "Submitted") => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.title,
        type: template,
        content: formData,
        status: status,
        dept: formData.dept,
        creatorName: formData.reporter,
      };

      await axios.put(`http://localhost:5000/api/reports/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(
        status === "Submitted"
          ? "Đã gửi phê duyệt thành công!"
          : "Đã lưu bản nháp!",
      );
      navigate("/employee-reports");
    } catch (err) {
      alert(
        "Lỗi: " + (err.response?.data?.message || "Không thể kết nối Server"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: 10,
      filename: `Bao_cao_${formData.title}_${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const renderTemplateForm = () => {
    return (
      <div className="space-y-4">
        {/* PHẦN CHỈNH SỬA THÔNG TIN HÀNH CHÍNH */}
        <div className="space-y-3 pb-4 border-b border-gray-100">
          <h4 className="text-[10px] font-bold text-blue-600 uppercase">
            Thông tin chung
          </h4>
          <input
            type="text"
            placeholder="Tên công ty"
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-100 text-sm outline-none focus:border-blue-400"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Số hiệu"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-100 text-sm outline-none focus:border-blue-400"
              value={formData.reportNumber}
              onChange={(e) =>
                setFormData({ ...formData, reportNumber: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Địa danh"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-100 text-sm outline-none focus:border-blue-400"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <input
            type="text"
            placeholder="Kính gửi"
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-100 text-sm outline-none focus:border-blue-400"
            value={formData.recipient}
            onChange={(e) =>
              setFormData({ ...formData, recipient: e.target.value })
            }
          />
        </div>

        {/* PHẦN NỘI DUNG BIẾN THIÊN */}
        <h4 className="text-[10px] font-bold text-blue-600 uppercase">
          Nội dung chi tiết
        </h4>

        {template === "finance" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  TỔNG THU
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-100"
                  value={formData.income}
                  onChange={(e) =>
                    setFormData({ ...formData, income: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  TỔNG CHI
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-100"
                  value={formData.expense}
                  onChange={(e) =>
                    setFormData({ ...formData, expense: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                CHI TIẾT
              </label>
              <textarea
                rows="4"
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-100"
                value={formData.detail}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
              ></textarea>
            </div>
          </div>
        )}
        {template === "daily" && (
          <div className="space-y-4">
            <textarea
              placeholder="Việc đã xong..."
              rows="3"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100"
              value={formData.done}
              onChange={(e) =>
                setFormData({ ...formData, done: e.target.value })
              }
            ></textarea>
            <textarea
              placeholder="Khó khăn..."
              rows="2"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100"
              value={formData.issues}
              onChange={(e) =>
                setFormData({ ...formData, issues: e.target.value })
              }
            ></textarea>
            <textarea
              placeholder="Kế hoạch mai..."
              rows="2"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100"
              value={formData.plan}
              onChange={(e) =>
                setFormData({ ...formData, plan: e.target.value })
              }
            ></textarea>
          </div>
        )}
        {template === "business" && (
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Chỉ tiêu KPI (%)"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100"
              value={formData.kpi}
              onChange={(e) =>
                setFormData({ ...formData, kpi: e.target.value })
              }
            />
            <textarea
              placeholder="Phân tích dự án..."
              rows="6"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100"
              value={formData.analysis}
              onChange={(e) =>
                setFormData({ ...formData, analysis: e.target.value })
              }
            ></textarea>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Đang tải báo cáo...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans relative">
      <aside className="w-[280px] bg-white border-r border-gray-100 p-6 flex flex-col text-left">
        <div
          className="flex items-center gap-3 mb-10 px-2 cursor-pointer"
          onClick={() => navigate("/employee-reports")}
        >
          <div className="w-10 h-10 bg-[#0061f2] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            G
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">KTBM</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Nhân viên
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            onClick={() => navigate("/employee-dashboard")}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Báo cáo của tôi"
            onClick={() => navigate("/employee-reports")}
          />
          <NavItem
            icon={<FilePlus size={20} />}
            label="Tạo báo cáo"
            onClick={() => navigate("/employee-create-report")}
          />
        </nav>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all mt-auto font-semibold"
        >
          <LogOut size={20} /> Thoát
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center px-10 sticky top-0 z-10 shadow-sm justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employee-reports")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              Chỉnh sửa báo cáo nháp
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmitReport("Draft")}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 disabled:opacity-50"
            >
              <Save size={18} /> Lưu nháp
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black shadow-md"
            >
              <Printer size={18} /> Xuất PDF
            </button>
            <button
              onClick={() => handleSubmitReport("Submitted")}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#0061f2] text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              <Send size={18} /> Gửi phê duyệt
            </button>
          </div>
        </header>

        <main className="p-10 flex-1">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-fit">
              <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                Thông tin nhập liệu
              </h4>
              {renderTemplateForm()}
            </div>

            <div className="col-span-8 bg-gray-200 p-8 rounded-[32px] flex justify-center overflow-y-auto max-h-[1200px]">
              <div
                ref={reportRef}
                className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl text-black font-sans tracking-normal"
                style={{ fontSize: "13pt", letterSpacing: 0.2 }}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="text-center font-bold">
                    <p className="uppercase">{formData.companyName}</p>
                    <p className="border-b border-black inline-block px-4">
                      Số: {formData.reportNumber}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </p>
                    <p className="font-bold border-b border-black inline-block px-4">
                      Độc lập – Tự do – Hạnh phúc
                    </p>
                    <p className="italic mt-2 text-sm">
                      {formData.location}, ngày {new Date().getDate()} tháng{" "}
                      {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                    </p>
                  </div>
                </div>

                <h2 className="text-center font-bold text-2xl uppercase mb-8">
                  {formData.title}
                </h2>

                <div className="space-y-4 text-justify">
                  <p>
                    <span className="font-bold italic">Kính gửi:</span>{" "}
                    {formData.recipient}
                  </p>
                  <p>
                    Tôi tên là:{" "}
                    <span className="font-bold uppercase ml-2">
                      {formData.reporter}
                    </span>
                  </p>
                  <p>
                    Bộ phận công tác:{" "}
                    <span className="font-bold ml-2">{formData.dept}</span>
                  </p>
                  <p>
                    Nay tôi làm báo cáo này để cập nhật tình hình hoạt động cụ
                    thể như sau:
                  </p>

                  <div className="mt-6 border-l-4 border-gray-200 pl-4 py-2 bg-gray-50/50">
                    {template === "finance" && (
                      <div className="space-y-3">
                        <p>
                          - Tổng tiền thu:{" "}
                          <span className="font-bold">
                            {Number(formData.income).toLocaleString()} VNĐ
                          </span>
                        </p>
                        <p>
                          - Tổng chi phí:{" "}
                          <span className="font-bold">
                            {Number(formData.expense).toLocaleString()} VNĐ
                          </span>
                        </p>
                        <p>- Nội dung chi tiết: {formData.detail || "..."}</p>
                      </div>
                    )}
                    {template === "daily" && (
                      <div className="space-y-3">
                        <p>- Hoàn thành: {formData.done || "..."}</p>
                        <p>- Khó khăn: {formData.issues || "..."}</p>
                        <p>- Kế hoạch: {formData.plan || "..."}</p>
                      </div>
                    )}
                    {template === "business" && (
                      <div className="space-y-3">
                        <p>
                          - Chỉ tiêu KPI:{" "}
                          <span className="font-bold">{formData.kpi}%</span>
                        </p>
                        <p>- Phân tích: {formData.analysis || "..."}</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-10 italic">
                    Tôi xin cam đoan các thông tin trên là hoàn toàn chính xác.
                  </p>
                </div>

                <div className="grid grid-cols-2 mt-20">
                  <div className="text-center font-bold">Ý KIẾN QUẢN LÝ</div>
                  <div className="text-center">
                    <p className="font-bold">NGƯỜI LÀM ĐƠN</p>
                    <div className="h-24"></div>
                    <p className="font-bold uppercase">{formData.reporter}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
  onClick,
  disabled = false,
}) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
      disabled
        ? "cursor-not-allowed"
        : active
          ? "bg-blue-50 text-[#0061f2] font-bold shadow-sm"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

export default EditReport;
