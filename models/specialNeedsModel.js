const mongoose = require("mongoose");

const specialNeedsSchema = new mongoose.Schema({
  special_need: {
    type: String,
    required: true,
  },
  health_record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "health_records",
    required: true,
  },
});

const SpecialNeeds = mongoose.model("special_needs", specialNeedsSchema);
module.exports = SpecialNeeds;
