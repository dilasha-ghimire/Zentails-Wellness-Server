const express = require("express");
const router = express.Router();
const {
  getAllMedicalHistories,
  getMedicalHistoryById,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory
} = require("../controllers/medicalHistoryController");

router.get("/", getAllMedicalHistories);
router.get("/:id", getMedicalHistoryById);
router.post("/", createMedicalHistory);
router.put("/:id", updateMedicalHistory);
router.delete("/:id", deleteMedicalHistory);

module.exports = router;
