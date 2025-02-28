const TherapySession = require("../models/therapySessionModel");
const Customer = require("../models/customerModel");
const Pet = require("../models/petModel");
const sendEmail = require("../utils/emailService");

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

    // Convert HHMM format to minutes
    const toMinutes = (time) => Math.floor(time / 100) * 60 + (time % 100);

    // Ensure time difference is in hourly intervals
    const startMinutes = toMinutes(start_time);
    const endMinutes = toMinutes(end_time);

    if (endMinutes <= startMinutes || (endMinutes - startMinutes) % 60 !== 0) {
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
        { start_time: { $lte: start_time }, end_time: { $gte: end_time } }, // Fully contains new session
      ],
    });

    if (existingSession) {
      return res
        .status(400)
        .json({ error: "Pet is already booked for this time" });
    }

    // Calculate duration and total charge
    const duration = (endMinutes - startMinutes) / 60; // Hours
    const total_charge = duration * pet.charge_per_hour;

    const session = new TherapySession({
      date,
      start_time,
      end_time,
      duration,
      total_charge,
      status,
      user_id,
      pet_id,
    });

    await session.save();
    pet.availability = false;
    await pet.save();

    // Fetch customer details
    const customer = await Customer.findById(user_id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Convert start_time and end_time to HH:MM AM/PM format
    const formatTime = (time) => {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert 0/12 to 12
      const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits
      return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    const formattedStartTime = formatTime(start_time);
    const formattedEndTime = formatTime(end_time);

    // Email content
    const subject = "Your Therapy Session is Confirmed! 🐾";
    const text = `
      Dear ${customer.full_name},

      Your therapy session is confirmed. Here are the details:
      - 🐾 Pet Name: ${pet.name}
      - 🐾 Pet Breed: ${pet.breed}
      - 🐾 Pet Description: ${pet.description || "No description provided"}
      - 📅 Date: ${new Date(date).toDateString()}
      - ⏰ Time: ${formattedStartTime} - ${formattedEndTime}
      - ⏳ Duration: ${duration} hour(s)
      - 💰 Total Charge: Rs.${total_charge}

      Thank you for choosing our service! 🐶🐾
      `;

    const html = `
        <h2>Dear ${customer.full_name},</h2>
        <p>Your therapy session is confirmed. Here are the details:</p>
        <ul>
          <li><strong>🐾 Pet Name:</strong> ${pet.name}</li>
          <li><strong>🐾 Pet Breed:</strong> ${pet.breed}</li>
          <li><strong>🐾 Pet Description:</strong> ${
            pet.description || "No description provided"
          }</li>
          <li><strong>📅 Date:</strong> ${new Date(date).toDateString()}</li>
          <li><strong>⏰ Time:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
          <li><strong>⏳ Duration:</strong> ${duration} hour(s)</li>
          <li><strong>💰 Total Charge:</strong> Rs.${total_charge}</li>
        </ul>
        <p>Thank you for choosing our service! 🐶🐾</p>
      `;

    // Send email
    await sendEmail(customer.email, subject, text, html);

    res
      .status(201)
      .json({ message: "Therapy session booked and email sent", session });
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
      return res
        .status(404)
        .json({ error: "No therapy sessions found for this user" });
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
  deleteTherapySession,
};
