const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
  condition: {
    type: String,
    required: true,
  },
  treatment_date: {
    type: String,
    required: true,
  },
  health_record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "health_records",
    required: true,
  },
});

const MedicalHistory = mongoose.model(
  "medical_histories",
  medicalHistorySchema
);
module.exports = MedicalHistory;
