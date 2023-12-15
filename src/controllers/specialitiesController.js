const Speciality = require('../models/speciality');
const { validationResult } = require('express-validator');


const specialitiesController = {};

specialitiesController.getAllSpecialities = async (req, res, next) => {
  try {
    const specialities = await Speciality.find();
    res.json(specialities);
  } catch (error) {
    next(error);
  }
};

specialitiesController.addSpeciality = async (req, res, next) => {
  try {

    const { name } = req.body;

    const existingSpeciality = await Speciality.findOne({ name });
    if (existingSpeciality) {
      return res.status(422).json({ message: 'La especialidad ya existe' });
    }

    const newSpeciality = new Speciality({
      name,
    });

    await newSpeciality.save();

    res.status(201).json({ message: 'Especialidad añadida exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = specialitiesController;
