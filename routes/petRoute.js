const express = require("express");
const router = express.Router();
const petupload = require("./../utils/upload").petupload;

const {
  findAll,
  save,
  findById,
  updateById,
  deleteById,
  uploadImage
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
router.post("/", save); // Add a new pet
router.get("/:id", findById); // Fetch a pet by ID
router.delete("/:id", deleteById); // Delete a pet by ID
router.put("/:id", updateById); // Update a pet by ID
router.post("/uploadImage", petupload, (req, res) => {
  uploadImage(req, res).catch((err) => {
    res
      .status(500)
      .send("An error occurred during file upload: " + err.message);
  });
});

module.exports = router;
