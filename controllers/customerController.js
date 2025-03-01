// Import the Customer model to interact with the "customers" collection in MongoDB.
const Customer = require("../models/customerModel");
const fs = require("fs");
const path = require("path");
// Import the Credential model
const Credential = require("../models/credentials");

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
    const existingCustomer = await Customer.findOne({ email: req.body.email });
    if (existingCustomer) {
      return res.status(409).json({ error: "Customer already exists" });
    }

    const customer = new Customer(req.body); // Create a new Customer instance with the request body data.
    await customer.save(); // Save the new customer to the database.
    res.status(201).json(customer); // Respond with the saved data and a 201 Created status code.
  } catch (e) {
    res.status(500).json({ error: e.message }); // Respond with an error message and a 500 Internal Server Error status code.
  }
};

// Function to find a customer by their ID.
const findById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id); // Fetch the customer document matching the given ID.
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer); // Respond with the fetched data and a 200 OK status code.
  } catch (e) {
    res.status(500).json({ error: e.message }); // Respond with an error message and a 500 Internal Server Error status code.
  }
};

// Function to delete a customer by their ID.
const deleteById = async (req, res) => {
  try {
    // Find the customer by ID
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Delete the corresponding credential using the customer's email
    await Credential.deleteOne({ user_id: customer._id });

    // Now delete the customer
    await Customer.deleteOne({ _id: req.params.id });

    res.status(200).json("Customer and corresponding credential deleted"); // Respond with a success message and a 200 OK status code.
  } catch (e) {
    res.status(500).json({ error: e.message }); // Respond with an error message and a 500 Internal Server Error status code.
  }
};

// Function to update a customer by their ID.
const updateById = async (req, res) => {
  try {
    // Find the existing customer
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Check if the email is being updated
    const emailChanged = req.body.email && req.body.email !== customer.email;

    // Update the customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    // If email was updated, update the Credential table as well
    if (emailChanged) {
      await Credential.findOneAndUpdate(
        { email: customer.email }, // Find by old email
        { email: req.body.email } // Update with new email
      );
    }

    res.status(200).json(updatedCustomer); // Respond with updated customer data
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Function to upload an image.
const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  // Optionally, add further checks here for file type or size.
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
};

//upload customer with image
const updateWithImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, contact_number, address, profilePicture } =
      req.body;

    // Find existing customer
    let customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // If a new profile picture is uploaded, process it
    let updatedProfilePicture = customer.profilePicture; // Default to existing picture
    if (req.file) {
      // A new file was uploaded, replace the old one
      if (customer.profilePicture) {
        const oldImagePath = path.join(
          __dirname,
          "../public/uploads/customers",
          customer.profilePicture
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }
      updatedProfilePicture = req.file.filename; // Set new filename
    }

    // Update customer details
    customer.full_name = full_name || customer.full_name;
    customer.email = email || customer.email;
    customer.contact_number = contact_number || customer.contact_number;
    customer.address = address || customer.address;
    customer.profilePicture = updatedProfilePicture;

    // Save the updated customer
    await customer.save();

    res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const customer = await Customer.findByIdAndUpdate(
      userId,
      { active: false },
      { new: true }
    );

    if (!customer) {
      return res
        .status(404)
        .json({ status: "fail", message: "Customer not found" });
    }

    res.status(200).json({ status: "success", data: { customer } });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

// Export all the functions so they can be used in other parts of the application.
module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  updateById,
  uploadImage,
  updateWithImageById,
  deactivateUser,
};
