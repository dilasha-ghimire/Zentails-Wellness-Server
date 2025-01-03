// Import the Customer model to interact with the "customers" collection in MongoDB.
const Customer = require("../models/customerModel");

// Function to fetch all customers from the database.
const findAll = async (req, res) => {
  try {
    const customers = await Customer.find(); // Fetch all documents in the "customers" collection.
    res.status(200).json(customers); // Respond with the fetched data and a 200 OK status code.
  } catch (e) {
    res.status(500).json({ error: e.message }); // Respond with an error message and a 500 Internal Server Error status code.
  }
};

// Function to save a new customer to the database.
const save = async (req, res) => {
  try {
    const customers = new Customer(req.body); // Create a new Customer instance with the request body data.
    await customers.save(); // Save the new customer to the database.
    res.status(201).json(customers); // Respond with the saved data and a 201 Created status code.
  } catch (e) {
    res.status(500).json({ error: e.message }); // Respond with an error message and a 500 Internal Server Error status code.
  }
};

// Function to find a customer by their ID.
const findById = async (req, res) => {
  try {
    const customers = await Customer.findById(req.params.id); // Fetch the customer document matching the given ID.
    res.status(200).json(customers); // Respond with the fetched data and a 200 OK status code.
  } catch (e) {
    res.status(500).json({ error: e.message }); // Respond with an error message and a 500 Internal Server Error status code.
  }
};

// Function to delete a customer by their ID.
const deleteById = async (req, res) => {
  try {
    const customers = await Customer.findByIdAndDelete(req.params.id); // Delete the customer document matching the given ID.
    res.status(200).json("Data deleted"); // Respond with a success message and a 200 OK status code.
  } catch (e) {
    res.status(500).json({ error: e.message }); // Respond with an error message and a 500 Internal Server Error status code.
  }
};

// Function to update a customer by their ID.
const updateById = async (req, res) => {
  try {
    const customers = await Customer.findByIdAndUpdate(
      req.params.id, // ID of the customer to update.
      req.body, // New data to update the customer with.
      { new: true } // Return the updated document after applying the changes.
    );
    res.status(201).json(customers); // Respond with the updated data and a 201 Created status code.
  } catch (e) {
    res.status(500).json({ error: e.message }); // Respond with an error message and a 500 Internal Server Error status code.
  }
};

// Export all the functions so they can be used in other parts of the application.
module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  updateById,
};
