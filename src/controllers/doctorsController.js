const Doctor = require('../models/doctor');
const { validationResult } = require('express-validator');
const validateAddDoctor = require('../validators/doctorValidators');

const doctorsController = {};

doctorsController.getAllDoctors = async (req, res, next) => {
  try {
    //obtener y devolver todos los médicos
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

doctorsController.getDoctorDetails = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    // obtener y devolver detalles de un médico específico
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Médico no encontrado' });
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

doctorsController.addDoctor = async (req, res, next) => {
  try {
    validateAddDoctor(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, speciality } = req.body;

    const newDoctor = new Doctor({
      name,
      speciality,
    });

    await newDoctor.save();

    res.status(201).json({ message: 'Médico añadido exitosamente' });
  } catch (error) {
    next(error);
  }
};


module.exports = doctorsController;
