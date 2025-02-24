// Import required libraries and modules
const express = require("express");
// Import the Express framework for creating a web server.
const connectDB = require("./config/db.js");
// Import the custom database connection function to connect to MongoDB.
const path = require("path"); // Import the path module

// Import router to handle routes operations.
const CustomerRouter = require("./routes/customerRoute");
const PetRouter = require("./routes/petRoute");
const AuthRouter = require("./routes/authRoute");
const HealthRecordRouter = require("./routes/healthRecordRoute");
const MedicalHistoryRouter = require("./routes/medicalHistoryRoute");
const VaccinationRouter = require("./routes/vaccinationRoute");
const SpecialNeedsRouter = require("./routes/specialNeedsRoute");

// Create an instance of the Express application.
const app = express();

// Connect to the MongoDB database by calling the database connection function.
connectDB();

// Middleware to parse incoming JSON request bodies.
app.use(express.json());

// Serve static files from the "public/uploads/customers" directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Mount the routes at the endpoints.
app.use("/api/customer", CustomerRouter);
app.use("/api/pet", PetRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/health-record", HealthRecordRouter);
app.use("/api/medical-history", MedicalHistoryRouter);
app.use("/api/vaccination", VaccinationRouter);
app.use("/api/special-needs", SpecialNeedsRouter);

// Define the port number the server will listen on.
const port = 3000;

// Start the server and listen on the specified port.
app.listen(port, () => {
  // Log a message when the server starts successfully.
  console.log(`Server is running at http://localhost:${port}`);
});
