const express = require("express");
const router = express.Router();
const {
  getAllSpecialNeeds,
  getSpecialNeedsById,
  createSpecialNeeds,
  updateSpecialNeeds,
  deleteSpecialNeeds
} = require("../controllers/specialNeedsController");

router.get("/", getAllSpecialNeeds);
router.get("/:id", getSpecialNeedsById);
router.post("/", createSpecialNeeds);
router.put("/:id", updateSpecialNeeds);
router.delete("/:id", deleteSpecialNeeds);

module.exports = router;
