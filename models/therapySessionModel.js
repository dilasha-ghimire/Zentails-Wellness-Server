const mongoose = require("mongoose");

const therapySessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  start_time: {
    type: Number, // Stores hours (e.g., 10 for 10 AM)
    required: true,
  },
  end_time: {
    type: Number, // Stores hours (e.g., 12 for 12 PM)
    required: true,
  },
  duration: {
    type: Number, // Derived from start and end time
  },
  total_charge: {
    type: Number, // Derived from duration * pet charge
  },
  status: {
    type: String,
    enum: ["scheduled", "in-progress", "complete"],
    default: "scheduled",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  pet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pets",
    required: true,
  },
});

// Middleware to update availability and calculate total charge
therapySessionSchema.pre("save", async function (next) {
  const Pet = mongoose.model("pets");

  if (this.start_time && this.end_time) {
    const startHours = Math.floor(this.start_time / 100);
    const startMinutes = this.start_time % 100;
    const endHours = Math.floor(this.end_time / 100);
    const endMinutes = this.end_time % 100;

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    this.duration = (endTotalMinutes - startTotalMinutes) / 60;
  }

  const pet = await Pet.findById(this.pet_id);
  if (!pet) {
    return next(new Error("Pet not found"));
  }

  this.total_charge = this.duration * pet.charge_per_hour;

  if (this.status === "scheduled") {
    pet.availability = false;
    await pet.save();
  }

  next();
});

therapySessionSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  const Pet = mongoose.model("pets");

  if (doc.status === "complete") {
    const pet = await Pet.findById(doc.pet_id);
    if (pet) {
      pet.availability = true;
      await pet.save();
    }
  }
});

const TherapySession = mongoose.model("therapy_sessions", therapySessionSchema);
module.exports = TherapySession;
