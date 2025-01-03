// Import the mongoose library to interact with MongoDB.
const mongoose = require("mongoose"); 

const connectDB = async () => { 
    // Define an asynchronous function named 'connectDB'.
    try { 
        // Start a try block to attempt the database connection.
        await mongoose.connect("mongodb://localhost:27017/db_zentails_wellness"); 
        // Use mongoose's 'connect' method to establish a connection to MongoDB.
        // 'mongodb://localhost:27017/db_zentails_wellness' is the connection string:
        // - 'localhost' refers to the MongoDB server running on the local machine.
        // - '27017' is the default port for MongoDB.
        // - 'db_zentails_wellness' is the database name.
        console.log("MongoDB connected"); 
        // Log a success message to the console if the connection is successful.
    } catch (e) { 
        // Catch block to handle errors if the connection fails.
        console.log("MongoDB not connected"); 
        // Log an error message to the console if the connection is unsuccessful.
    }
}

module.exports = connectDB; 
// Export the 'connectDB' function so it can be imported and used in other files.
