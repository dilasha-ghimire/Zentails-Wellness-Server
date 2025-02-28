const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../security/auth");

const {
  getAllTherapySessions,
  getTherapySessionById,
  createTherapySession,
  deleteTherapySession,
  getTherapySessionsByUserId,
} = require("../controllers/therapySessionController");

router.get("/", authenticateToken, getAllTherapySessions);
router.get("/:id", authenticateToken, getTherapySessionById);
router.get(
  "/user/:userId",
  authenticateToken,
  authorizeRole(["admin", "customer"]),
  getTherapySessionsByUserId
);

router.post(
  "/",
  authenticateToken,
  authorizeRole(["admin", "customer"]),
  createTherapySession
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  deleteTherapySession
);

module.exports = router;
