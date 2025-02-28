const express = require("express");
const router = express.Router();
const {
  getAllHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} = require("../controllers/healthRecordController");
const { authenticateToken, authorizeRole } = require("../security/auth");

router.get(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  getAllHealthRecords
);
router.get("/:id", authenticateToken, getHealthRecordById);
router.post(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  createHealthRecord
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  updateHealthRecord
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  deleteHealthRecord
);

module.exports = router;
