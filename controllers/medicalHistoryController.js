const MedicalHistory = require("../models/medicalHistoryModel");

// Get all medical history records
const getAllMedicalHistories = async (req, res) => {
  try {
    const histories = await MedicalHistory.find().populate("pet_id");
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single medical history record by ID
const getMedicalHistoryById = async (req, res) => {
  try {
    const history = await MedicalHistory.findById(req.params.id).populate("pet_id");
    if (!history) return res.status(404).json({ error: "Medical history not found" });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new medical history record
const createMedicalHistory = async (req, res) => {
  try {
    const newHistory = new MedicalHistory(req.body);
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing medical history record
const updateMedicalHistory = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHistory) return res.status(404).json({ error: "Medical history not found" });
    res.json(updatedHistory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a medical history record
const deleteMedicalHistory = async (req, res) => {
  try {
    const history = await MedicalHistory.findByIdAndDelete(req.params.id);
    if (!history) return res.status(404).json({ error: "Medical history not found" });
    res.json({ message: "Medical history deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllMedicalHistories,
  getMedicalHistoryById,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory
};
