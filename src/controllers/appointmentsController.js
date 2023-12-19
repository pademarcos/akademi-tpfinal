const Appointment = require('../models/appointment');
const { validationResult } = require('express-validator');
const appointmentsValidators = require('../validators/appointmentsValidators');

const appointmentsController = {};

appointmentsController.addAppointment = async (req, res, next) => {
  try {
    appointmentsValidators.validateAddAppointment(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { doctor, date, patient } = req.body;
    //const patient = req.user.userId; 

    const newAppointment = new Appointment({
      doctor,
      patient,
      date,
    });

    await newAppointment.save();

    res.status(201).json({ message: 'Turno registrado exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = appointmentsController;
