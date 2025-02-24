const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema({
  vaccine_name: {
    type: String,
    required: true,
  },
  vaccination_date: {
    type: String,
    required: true,
  },
  health_record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "health_records",
    required: true,
  },
});

const Vaccination = mongoose.model("vaccinations", vaccinationSchema);
module.exports = Vaccination;
