const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema({
  last_checkup_date: {
    type: String,
    required: true,
  },
  pet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pets",
    required: true,
  },
});

const HealthRecord = mongoose.model("health_records", healthRecordSchema);
module.exports = HealthRecord;
