const express = require("express");
const router = express.Router();
const {
  getAllTherapySessions,
  getTherapySessionById,
  createTherapySession,
  updateTherapySession,
  deleteTherapySession,
} = require("../controllers/therapySessionController");

const { authenticateToken, authorizeRole } = require("../security/auth");

router.get("/", authenticateToken, getAllTherapySessions);
router.get("/:id", authenticateToken, getTherapySessionById);
router.post("/", authenticateToken, authorizeRole(["admin", "customer"]), createTherapySession);
router.put("/:id", authenticateToken, authorizeRole(["admin"]), updateTherapySession);
router.delete("/:id", authenticateToken, authorizeRole(["admin"]), deleteTherapySession);

module.exports = router;
