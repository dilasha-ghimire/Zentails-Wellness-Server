const express = require("express");
const router = express.Router();
const {
  findAll,
  save,
  findById,
  updateById,
  deleteById,
} = require("../controllers/petController");
// const { authenticateToken } = require("../security/auth");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "C:/Users/ghimi/Desktop/Zentails-Wellness-Server/assets/pets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Define routes for pets
router.get("/", findAll); // Fetch all pets
router.post("/", upload.single("file"), save); // Add a new pet
router.get("/:id", findById); // Fetch a pet by ID
router.delete("/:id", deleteById); // Delete a pet by ID
router.put("/:id", updateById); // Update a pet by ID

module.exports = router;
