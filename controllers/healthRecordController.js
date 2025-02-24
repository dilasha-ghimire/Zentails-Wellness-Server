const HealthRecord = require("../models/healthRecordModel");

// Get all health records
const getAllHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find().populate("pet_id");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single health record by ID
const getHealthRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id).populate("pet_id");
    if (!record) return res.status(404).json({ error: "Health record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new health record
const createHealthRecord = async (req, res) => {
  try {
    const newRecord = new HealthRecord(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing health record
const updateHealthRecord = async (req, res) => {
  try {
    const updatedRecord = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecord) return res.status(404).json({ error: "Health record not found" });
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a health record
const deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: "Health record not found" });
    res.json({ message: "Health record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord
};
