const express = require("express");
const router = express.Router();
const {
  getAllHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord
} = require("../controllers/healthRecordController");

router.get("/", getAllHealthRecords);
router.get("/:id", getHealthRecordById);
router.post("/", createHealthRecord);
router.put("/:id", updateHealthRecord);
router.delete("/:id", deleteHealthRecord);

module.exports = router;
