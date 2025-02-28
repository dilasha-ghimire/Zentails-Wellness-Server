const express = require("express");
const router = express.Router();
const {
  getAllSpecialNeeds,
  getSpecialNeedsById,
  createSpecialNeeds,
  updateSpecialNeeds,
  deleteSpecialNeeds,
} = require("../controllers/specialNeedsController");
const { authenticateToken, authorizeRole } = require("../security/auth");

router.get(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  getAllSpecialNeeds
);
router.get("/:id", authenticateToken, getSpecialNeedsById);
router.post(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  createSpecialNeeds
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  updateSpecialNeeds
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  deleteSpecialNeeds
);

module.exports = router;
