const mongoose = require("mongoose");
const Pet = require("../models/petModel");
const HealthRecord = require("../models/healthRecordModel");
const MedicalHistory = require("../models/medicalHistoryModel");
const SpecialNeeds = require("../models/specialNeedsModel");
const Vaccination = require("../models/vaccinationModel");

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
    const { name, age, breed, description, availability, charge_per_hour } =
      req.body;

    const image = req.file ? req.file.filename : null;

    const pet = new Pet({
      name,
      age,
      breed,
      description,
      availability,
      charge_per_hour,
      image, // Here you expect the image name from the client
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid pet ID format" });
    }

    // Find the pet
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Find the pet's health record
    const healthRecord = await HealthRecord.findOne({ pet_id: pet._id });

    if (!healthRecord) {
      return res.status(200).json({
        pet,
        healthRecord: null,
        medicalHistory: [],
        specialNeeds: [],
        vaccinations: [],
      });
    }

    // Find related records using health_record_id
    const [medicalHistory, specialNeeds, vaccinations] = await Promise.all([
      MedicalHistory.find({ health_record_id: healthRecord._id }),
      SpecialNeeds.find({ health_record_id: healthRecord._id }),
      Vaccination.find({ health_record_id: healthRecord._id }),
    ]);

    res.status(200).json({
      pet,
      healthRecord,
      medicalHistory,
      specialNeeds,
      vaccinations,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Delete a pet by ID
const deleteById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid pet ID format" });
    }
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
// Update a pet by ID
const updateById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid pet ID format" });
    }
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    res.status(200).json(updatedPet);
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

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  updateById,
  uploadImage,
};
