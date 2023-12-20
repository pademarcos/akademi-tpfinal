const { verifyAdminPermissions } = require('../controllers/usersController');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment'); 
const Speciality = require('../models/speciality');
const { validationResult } = require('express-validator');
const validateAddDoctor = require('../validators/doctorValidators');


const doctorsController = {};

doctorsController.getDoctorWithAppointments = async (req, res, next) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Médico no encontrado' });
    }

    const appointments = await Appointment.find({
      doctor: doctorId,
      isReserved: false,
      date: { $gte: new Date() }, 
    });

    res.json({
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        speciality: doctor.speciality,
      },
      appointments: appointments,
    });
  } catch (error) {
    next(error);
  }
};

doctorsController.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

doctorsController.getDoctorDetails = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
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

    const existingSpeciality = await Speciality.findOne({ name: speciality });

    if (!existingSpeciality) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    const newDoctor = new Doctor({
      name,
      speciality: existingSpeciality._id,
    });

    await newDoctor.save();

    res.status(201).json({ message: 'Médico añadido exitosamente' });
  } catch (error) {
    next(error);
  }
};

doctorsController.updateDoctor = async (req, res, next) => {
  try {
    
    verifyAdminPermissions(req, res, next);
    const doctorId = req.params.id;
    const { name, speciality } = req.body;

    const existingSpeciality = await Speciality.findOne({ name: speciality });

    if (!existingSpeciality) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { name, speciality: existingSpeciality._id },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Médico no encontrado' });
    }

    res.json({ message: 'Médico actualizado exitosamente' });
  } catch (error) {
    next(error);
  }
};


module.exports = doctorsController;
