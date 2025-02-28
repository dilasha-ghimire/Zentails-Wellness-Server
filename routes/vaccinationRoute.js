const express = require("express");
const router = express.Router();
const {
  getAllVaccinations,
  getVaccinationById,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} = require("../controllers/vaccinationController");
const { authenticateToken, authorizeRole } = require("../security/auth");

router.get(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  getAllVaccinations
);
router.get("/:id", authenticateToken, getVaccinationById);
router.post(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  createVaccination
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  updateVaccination
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  deleteVaccination
);

module.exports = router;
