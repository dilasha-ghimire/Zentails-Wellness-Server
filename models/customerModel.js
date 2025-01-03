// Import the mongoose library for defining schemas and interacting with MongoDB.
const mongoose = require("mongoose"); 

// Define the schema for the "customers" collection.
const customerSchema = new mongoose.Schema({
    full_name: { 
        type: String, 
        required: true 
        // 'full_name' is a string field and is mandatory.
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
        // 'email' is a string field, must be unique, and is mandatory.
    },
    contact_number: { 
        type: String, 
        required: true 
        // 'contact_number' is a string field and is mandatory.
    },
    address: { 
        type: String, 
        required: true 
        // 'address' is a string field and is mandatory.
    },
});

// Create a model from the schema and name the collection "customers".
const Customer = mongoose.model("customers", customerSchema);

// Export the model so it can be used in other files.
module.exports = Customer;
