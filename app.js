const cors = require("cors");
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
const TherapySessionRouter = require("./routes/therapySessionRoute");

// Import the scheduler function to update therapy session status automatically
const updateExpiredTherapySessions = require("./utils/scheduler");

// Create an instance of the Express application.
const app = express();

// Function to start the server after ensuring the database connection is established
const startServer = async () => {
  try {
    // Connect to the MongoDB database and wait for it to establish a connection
    await connectDB();

    // Start the scheduler AFTER the database connection is established
    updateExpiredTherapySessions();

    // Enable CORS (Cross-Origin Resource Sharing)
    app.use(cors());

    app.use(
      cors({
        origin: "http://localhost:5173", // Allow requests only from this frontend
        methods: "GET,POST,PUT,PATCH,DELETE", // Allowed HTTP methods
        allowedHeaders: "Content-Type,Authorization", // Allowed headers
        credentials: true, // Allow cookies (if needed)
      })
    );

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
    app.use("/api/therapysessions", TherapySessionRouter);

    // Define the port number the server will listen on.
    const port = 3000;

    // Start the server and listen on the specified port.
    app.listen(port, () => {
      // Log a message when the server starts successfully.
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    // Log an error message and exit the process if server startup fails
    console.error("Error starting server:", error);
    process.exit(1); // Exit if there's a critical error
  }
};

// Start the server by calling the function
startServer();
