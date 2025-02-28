const express = require("express");
const router = express.Router();
const {
  getAllMedicalHistories,
  getMedicalHistoryById,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
} = require("../controllers/medicalHistoryController");
const { authenticateToken, authorizeRole } = require("../security/auth");

router.get(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  getAllMedicalHistories
);
router.get("/:id", authenticateToken, getMedicalHistoryById);
router.post(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  createMedicalHistory
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  updateMedicalHistory
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  deleteMedicalHistory
);

module.exports = router;
