const Vaccination = require("../models/vaccinationModel");

// Get all vaccinations
const getAllVaccinations = async (req, res) => {
  try {
    const records = await Vaccination.find().populate("health_record_id");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single vaccination by ID
const getVaccinationById = async (req, res) => {
  try {
    const record = await Vaccination.findById(req.params.id).populate("health_record_id");
    if (!record) return res.status(404).json({ error: "Vaccination not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new vaccination
const createVaccination = async (req, res) => {
  try {
    const newRecord = new Vaccination(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing vaccination
const updateVaccination = async (req, res) => {
  try {
    const updatedRecord = await Vaccination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecord) return res.status(404).json({ error: "Vaccination not found" });
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a vaccination
const deleteVaccination = async (req, res) => {
  try {
    const record = await Vaccination.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: "Vaccination not found" });
    res.json({ message: "Vaccination deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllVaccinations,
  getVaccinationById,
  createVaccination,
  updateVaccination,
  deleteVaccination
};
