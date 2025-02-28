const TherapySession = require("../models/therapySessionModel");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Connect to MongoDB
connectDB();

// Function to update expired therapy sessions
const updateExpiredTherapySessions = async () => {
  try {
    const now = new Date();
    const currentHour = now.getHours();

    const expiredSessions = await TherapySession.find({
      date: { $lt: now.toISOString().split("T")[0] }, // Sessions from past dates
      status: { $ne: "complete" }, // Not already completed
    });

    const currentDaySessions = await TherapySession.find({
      date: now.toISOString().split("T")[0], // Today's date
      end_time: { $lte: currentHour }, // End time passed
      status: { $ne: "complete" },
    });

    const sessionsToUpdate = [...expiredSessions, ...currentDaySessions];

    for (let session of sessionsToUpdate) {
      session.status = "complete";
      await session.save();
    }

    console.log(
      `${sessionsToUpdate.length} therapy sessions marked as complete.`
    );
  } catch (error) {
    console.error("Error updating therapy sessions:", error);
  }
};

// Run every hour
setInterval(updateExpiredTherapySessions, 60 * 60 * 1000); // Every hour

module.exports = updateExpiredTherapySessions;
