const Speciality = require('../models/speciality');

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
    console.log(req.body); 
    const { name } = req.body;

    console.log(req.body);

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
