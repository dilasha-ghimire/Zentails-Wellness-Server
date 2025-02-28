const TherapySession = require("../models/therapySessionModel");
const Pet = require("../models/petModel");
const cron = require("node-cron");

// Function to update expired therapy sessions
const updateExpiredTherapySessions = async () => {
  try {
    const now = new Date();
    console.log("Current Time (UTC): ", now);

    // Calculate the UTC offset for Nepal (GMT+5:45)
    const utcOffset = 5 * 60 + 45; // in minutes
    const localTime = new Date(now.getTime() + utcOffset * 60 * 1000); // adjust the time by offset

    console.log("Local Now:", localTime);

    const currentDate = localTime.toISOString().split("T")[0];
    console.log("Current Date (ISO):", currentDate);

    const localNow = localTime.toISOString(); // This already gives you the correct local time in ISO format

    // Extract time in HH:MM format
    const timeString = localNow.split("T")[1].split(":"); // Split the string to get hours and minutes
    const hours = parseInt(timeString[0], 10); // Get the hours
    const minutes = parseInt(timeString[1], 10); // Get the minutes

    // Format time as HHMM
    const nowTime = hours * 100 + minutes;
    console.log(`Extracted time (nowTime): ${nowTime}`);

    const expiredSessions = await TherapySession.find({
      $or: [
        {
          date: { $lt: currentDate },
          status: { $ne: "complete" },
        },
        {
          date: currentDate,
          end_time: { $lte: nowTime },
          status: { $ne: "complete" },
        },
      ],
    });

    if (expiredSessions.length > 0) {
      const petIds = expiredSessions.map((session) => session.pet_id);

      await TherapySession.updateMany(
        { _id: { $in: expiredSessions.map((session) => session._id) } },
        { $set: { status: "complete" } }
      );

      await Pet.updateMany(
        { _id: { $in: petIds } },
        { $set: { availability: true } }
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
cron.schedule("*/5 * * * *", async () => {
  console.log("Running expired session updater...");
  await updateExpiredTherapySessions();
});

// Export in case you need to trigger it manually
module.exports = updateExpiredTherapySessions;
