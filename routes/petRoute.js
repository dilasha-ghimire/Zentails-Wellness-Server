const express = require("express");
const router = express.Router();
const petupload = require("./../utils/upload").petupload;
const { authenticateToken, authorizeRole } = require("../security/auth");

const {
  findAll,
  save,
  findById,
  updateById,
  deleteById,
  uploadImage,
} = require("../controllers/petController");

// Define routes for pets
router.get(
  "/",
  authenticateToken,
  authorizeRole(["admin", "customer"]),
  findAll
); // Fetch all pets
router.post("/", authenticateToken, authorizeRole(["admin"]), petupload, save);
// Add a new pet
router.get(
  "/:id",
  authenticateToken,
  authorizeRole(["admin", "customer"]),
  findById
); // Fetch a pet by ID
router.delete("/:id", authenticateToken, authorizeRole(["admin"]), deleteById);
// Delete a pet by ID
router.put("/:id", authenticateToken, authorizeRole(["admin"]), updateById);
// Update a pet by ID
router.post("/uploadImage", authenticateToken, petupload, (req, res) => {
  uploadImage(req, res).catch((err) => {
    res
      .status(500)
      .send("An error occurred during file upload: " + err.message);
  });
});

module.exports = router;
