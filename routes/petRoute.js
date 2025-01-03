const express = require("express");
const router = express.Router();
const {
  findAll,
  save,
  findById,
  updateById,
  deleteById,
} = require("../controllers/petController");

// Define routes for pets
router.get("/", findAll); // Fetch all pets
router.post("/", save); // Add a new pet
router.get("/:id", findById); // Fetch a pet by ID
router.delete("/:id", deleteById); // Delete a pet by ID
router.put("/:id", updateById); // Update a pet by ID

module.exports = router;
