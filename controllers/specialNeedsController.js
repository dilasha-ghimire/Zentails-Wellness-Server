const SpecialNeeds = require("../models/specialNeedsModel");

// Get all special needs records
const getAllSpecialNeeds = async (req, res) => {
  try {
    const needs = await SpecialNeeds.find().populate("pet_id");
    res.json(needs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single special needs record by ID
const getSpecialNeedsById = async (req, res) => {
  try {
    const need = await SpecialNeeds.findById(req.params.id).populate("pet_id");
    if (!need) return res.status(404).json({ error: "Special needs record not found" });
    res.json(need);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new special needs record
const createSpecialNeeds = async (req, res) => {
  try {
    const newNeed = new SpecialNeeds(req.body);
    await newNeed.save();
    res.status(201).json(newNeed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing special needs record
const updateSpecialNeeds = async (req, res) => {
  try {
    const updatedNeed = await SpecialNeeds.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNeed) return res.status(404).json({ error: "Special needs record not found" });
    res.json(updatedNeed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a special needs record
const deleteSpecialNeeds = async (req, res) => {
  try {
    const need = await SpecialNeeds.findByIdAndDelete(req.params.id);
    if (!need) return res.status(404).json({ error: "Special needs record not found" });
    res.json({ message: "Special needs record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllSpecialNeeds,
  getSpecialNeedsById,
  createSpecialNeeds,
  updateSpecialNeeds,
  deleteSpecialNeeds
};
