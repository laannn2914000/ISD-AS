const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const { validateReport } = require("../middleware/reportValidation");
const {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  approveReport,
} = require("../controllers/reportController");

router.get("/", verifyToken, getReports);
router.get("/:id", verifyToken, getReportById);
router.post("/", verifyToken, validateReport, createReport);
router.put("/:id", verifyToken, validateReport, updateReport);
router.delete("/:id", verifyToken, deleteReport);
router.patch(
  "/approve/:id",
  verifyToken,
  authorizeRoles("manager", "admin"),
  approveReport,
);

module.exports = router;
