const Pet = require("../models/petModel");

// Fetch all pets
const findAll = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets); // 200 OK
  } catch (e) {
    res.status(500).json({ error: e.message }); // 500 Internal Server Error
  }
};

// Save a new pet
const save = async (req, res) => {
  try {
    const pets = new Pet(req.body);
    await pets.save();
    res.status(201).json(pets); // 201 Created
  } catch (e) {
    res.status(500).json({ error: e.message }); // 500 Internal Server Error
  }
};

// Fetch a pet by ID
const findById = async (req, res) => {
  try {
    const pets = await Pet.findById(req.params.id);
    res.status(200).json(pets); // 200 OK
  } catch (e) {
    res.status(500).json({ error: e.message }); // 500 Internal Server Error
  }
};

// Delete a pet by ID
const deleteById = async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).json("Data deleted"); // 200 OK
  } catch (e) {
    res.status(500).json({ error: e.message }); // 500 Internal Server Error
  }
};

// Update a pet by ID
const updateById = async (req, res) => {
  try {
    const pets = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(pets); // 200 OK
  } catch (e) {
    res.status(500).json({ error: e.message }); // 500 Internal Server Error
  }
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  updateById,
};
