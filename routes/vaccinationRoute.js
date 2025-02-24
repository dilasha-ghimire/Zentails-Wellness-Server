const express = require("express");
const router = express.Router();
const {
  getAllVaccinations,
  getVaccinationById,
  createVaccination,
  updateVaccination,
  deleteVaccination
} = require("../controllers/vaccinationController");

router.get("/", getAllVaccinations);
router.get("/:id", getVaccinationById);
router.post("/", createVaccination);
router.put("/:id", updateVaccination);
router.delete("/:id", deleteVaccination);

module.exports = router;
