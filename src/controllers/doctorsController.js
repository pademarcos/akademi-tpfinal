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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const doctor = await Doctor.findById(doctorId).populate('speciality');
    if (!doctor) {
      return res.status(404).json({ message: 'Médico no encontrado' });
    }

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      isReserved: false,
      date: { $gte: new Date() },
    });

    const totalPages = Math.ceil(totalAppointments / pageSize);
    const skip = (page - 1) * pageSize;

    const appointments = await Appointment.find({
      doctor: doctorId,
      isReserved: false,
      date: { $gte: new Date() },
    })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.json({
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        speciality: doctor.speciality,
      },
      appointments: {
        data: appointments,
        pageInfo: {
          total: totalAppointments,
          totalPages,
          currentPage: page,
          hasNextPage,
          hasPreviousPage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

doctorsController.getAllDoctors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const skip = (page - 1) * pageSize;

    const totalDoctors = await Doctor.countDocuments();
    const totalPages = Math.ceil(totalDoctors / pageSize);

    const doctors = await Doctor.find()
      .populate('speciality')
      .skip(skip)
      .limit(pageSize)
      .exec();

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response = {
      doctors,
      pageInfo: {
        total: totalDoctors,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

doctorsController.getDoctorDetails = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId).populate('speciality');
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

    let existingSpeciality = await Speciality.findOne({ name: speciality });

    // Si no existe, crea una nueva especialidad
    if (!existingSpeciality) {
      existingSpeciality = new Speciality({
        name: speciality,
      });

      await existingSpeciality.save();
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
