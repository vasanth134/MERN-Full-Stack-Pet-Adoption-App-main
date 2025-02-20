const express = require("express");
const router = express.Router();
const Pet = require("../models/petModel");

// Get all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Add a pet
router.post("/", async (req, res) => {
  try {
    const { name, breed, age, price, imageUrl } = req.body;

    const newPet = new Pet({ name, breed, age, price, imageUrl });
    await newPet.save();

    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a pet
router.delete("/:id", async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /pets?species=dog
// router.get("/", async (req, res) => {
//   try {
//     const species = req.query.species;
//     const pets = await Pet.find(species ? { species } : {}); // Filters by species
//     res.json(pets);
//   } catch (error) {
//     console.error("Error fetching pets:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

module.exports = router;
