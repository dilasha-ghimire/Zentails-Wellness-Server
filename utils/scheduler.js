const TherapySession = require("../models/therapySessionModel");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const cron = require("node-cron");

// Connect to MongoDB
connectDB();

// Function to update expired therapy sessions
const updateExpiredTherapySessions = async () => {
  try {
    const now = new Date();

    const expiredSessions = await TherapySession.find({
      $or: [
        {
          date: { $lt: now.toISOString().split("T")[0] },
          status: { $ne: "complete" },
        },
        {
          date: now.toISOString().split("T")[0],
          end_time: { $lte: now.getHours() },
          status: { $ne: "complete" },
        },
      ],
    });

    if (expiredSessions.length > 0) {
      await TherapySession.updateMany(
        { _id: { $in: expiredSessions.map((session) => session._id) } },
        { $set: { status: "complete" } }
      );

      console.log(
        `${expiredSessions.length} therapy sessions marked as complete.`
      );
    }
  } catch (error) {
    console.error("Error updating therapy sessions:", error);
  }
};

// ⏰ Schedule the task to run **every hour**
cron.schedule("0 * * * *", async () => {
  console.log("Running expired session updater...");
  await updateExpiredTherapySessions();
});

// Export in case you need to trigger it manually
module.exports = updateExpiredTherapySessions;
