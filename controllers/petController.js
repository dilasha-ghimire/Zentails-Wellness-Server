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
    const { name, age, breed, description, availability, charge_per_hour, image } = req.body;

    const pet = new Pet({
      name,
      age,
      breed,
      description,
      availability,
      charge_per_hour,
      image // Here you expect the image name from the client
    });

    await pet.save();
    res.status(201).json(pet); // 201 Created
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

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  updateById,
  uploadImage,
};
