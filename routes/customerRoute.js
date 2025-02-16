// Import Express and create a router instance to define routes for the "customers" API.
const express = require("express");
const router = express.Router();
const customerupload = require("./../utils/upload").customerupload;

// Import controller functions from the "customerController" file to handle route logic.
const {
  findAll,
  save,
  findById,
  deleteById,
  updateById,
  uploadImage,
} = require("../controllers/customerController");

const CustomerValidation = require("../validation/customerValidation");

// Define a route to get all customers.
router.get("/", findAll);
// HTTP GET request to "/" triggers the `findAll` function to fetch all customer records.

// Define a route to save a new customer.
router.post("/", CustomerValidation, save);
// HTTP POST request to "/" triggers the `save` function to create a new customer record.

// Define a route to fetch a customer by ID.
router.get("/:id", findById);
// HTTP GET request to "/:id" triggers the `findById` function to fetch a customer by their ID.

// Define a route to delete a customer by ID.
router.delete("/:id", deleteById);
// HTTP DELETE request to "/:id" triggers the `deleteById` function to delete a customer by their ID.

// Define a route to update a customer by ID.
router.put("/:id", updateById);
// HTTP PUT request to "/:id" triggers the `updateById` function to update a customer by their ID.

router.post("/uploadImage", customerupload, (req, res) => {
  uploadImage(req, res).catch((err) => {
    res
      .status(500)
      .send("An error occurred during file upload: " + err.message);
  });
});

module.exports = router;
// Export the router so it can be used in other parts of the application.
