const mongoose = require("mongoose");

// Define the schema for the "pets" collection
const petSchema = new mongoose.Schema({
  name: {
    type: String, // Pet name is a string field
    required: true, // Pet name is required
  },
  age: {
    type: String, // Pet age is a String field
    required: true, // Pet age is required
  },
  breed: {
    type: String, // Pet breed is a string field
    required: true, // Pet breed is required
  },
  description: {
    type: String, // Description is a string field
    required: false, // Description is optional
  },
  availability: {
    type: Boolean, // Availability is a boolean field
    required: true, // Availability is required
  },
  charge_per_hour: {
    type: String, // Charge per hour is a string field
    required: true, // Charge per hour is required
  },
  image: {
    type: String, // Image is a string field as the name of image gets saved in the database
    required: false, // Image is not required
  },
});

// Create the Mongoose model for the "pets" collection
const Pet = mongoose.model("pets", petSchema);

// Export the model so it can be used in other files.
module.exports = Pet;
