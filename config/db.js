const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/db_zentails_wellness");
        console.log("MongoDB connected");
    } catch (e) {
        console.log("MongoDB not connected");
    }
}

module.exports = connectDB;