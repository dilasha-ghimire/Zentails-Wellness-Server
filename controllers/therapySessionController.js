const TherapySession = require("../models/therapySessionModel");
const Pet = require("../models/petModel");

// Get all therapy sessions
const getAllTherapySessions = async (req, res) => {
  try {
    const sessions = await TherapySession.find().populate("user_id pet_id");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single therapy session by ID
const getTherapySessionById = async (req, res) => {
  try {
    const session = await TherapySession.findById(req.params.id).populate(
      "user_id pet_id"
    );
    if (!session)
      return res.status(404).json({ error: "Therapy session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new therapy session
const createTherapySession = async (req, res) => {
  try {
    const { date, start_time, end_time, status, user_id, pet_id } = req.body;

    // Ensure time difference is in hourly intervals
    if ((end_time - start_time) % 1 !== 0) {
      return res
        .status(400)
        .json({ error: "Start and end time must have an hourly difference" });
    }

    const pet = await Pet.findById(pet_id);
    if (!pet) return res.status(404).json({ error: "Pet not found" });

    if (!pet.availability) {
      return res.status(400).json({ error: "Pet is already booked" });
    }

    const existingSession = await TherapySession.findOne({
      pet_id,
      status: { $ne: "complete" }, // Ignore completed sessions
      date,
      $or: [
        { start_time: { $lt: end_time, $gte: start_time } }, // Overlapping start
        { end_time: { $gt: start_time, $lte: end_time } }, // Overlapping end
      ],
    });

    if (existingSession) {
      return res
        .status(400)
        .json({ error: "Pet is already booked for this time" });
    }

    const session = new TherapySession({
      date,
      start_time,
      end_time,
      status,
      user_id,
      pet_id,
    });

    await session.save();
    pet.availability = false;
    await pet.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing therapy session
const updateTherapySession = async (req, res) => {
  try {
    const existingSession = await TherapySession.findById(req.params.id);
    if (!existingSession) {
      return res.status(404).json({ error: "Therapy session not found" });
    }

    const now = new Date();
    const sessionDate = new Date(existingSession.date);
    const currentHour = now.getHours();

    // Prevent changes if the session has started
    if (
      sessionDate.toISOString().split("T")[0] ===
        now.toISOString().split("T")[0] &&
      existingSession.start_time <= currentHour
    ) {
      return res
        .status(400)
        .json({ error: "Cannot modify an ongoing or completed session" });
    }

    const updatedSession = await TherapySession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a therapy session
const deleteTherapySession = async (req, res) => {
  try {
    const session = await TherapySession.findByIdAndDelete(req.params.id);
    if (!session)
      return res.status(404).json({ error: "Therapy session not found" });

    // Make pet available again
    const pet = await Pet.findById(session.pet_id);
    if (pet) {
      pet.availability = true;
      await pet.save();
    }

    res.json({ message: "Therapy session deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get therapy sessions by user ID
const getTherapySessionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all therapy sessions associated with the given user ID
    const sessions = await TherapySession.find({ user_id: userId })
      .populate("user_id pet_id")
      .sort({ date: -1, start_time: 1 }); // Sort by latest date, then by start time

    if (sessions.length === 0) {
      return res.status(404).json({ error: "No therapy sessions found for this user" });
    }

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTherapySessions,
  getTherapySessionById,
  getTherapySessionsByUserId,
  createTherapySession,
  updateTherapySession,
  deleteTherapySession,
};
