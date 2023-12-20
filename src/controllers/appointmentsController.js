const Appointment = require('../models/appointment');
const User = require('../models/user');
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

appointmentsController.reserveAppointment = async (req, res, next) => {
  try {
    const { appointmentId, userId } = req.body;

    // Buscar la cita en la base de datos
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar si la cita ya ha sido reservada o cancelada
    if (appointment.isReserved || appointment.isCanceled) {
      return res.status(400).json({ message: 'La cita no está disponible para reserva' });
    }

    // Marcar la cita como reservada y asignar el paciente
    appointment.isReserved = true;
    appointment.patient = userId; // El ID del paciente se obtiene del body

    await appointment.save();

    res.json({ message: 'Cita reservada exitosamente' });
  } catch (error) {
    next(error);
  }
};

appointmentsController.cancelAppointment = async (req, res, next) => {
  try {
    const { appointmentId, userId } = req.body;

    // Buscar la cita en la base de datos
    const appointment = await Appointment.findById(appointmentId).populate('doctor');
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar si la cita ya ha sido reservada
    if (appointment.isReserved) {
      // Cancelar la reserva
      appointment.isReserved = false;
      appointment.patient = null; // Eliminar el ID del paciente

      await appointment.save();

      // Agregar la cita cancelada al usuario
      const user = await User.findById(userId);
      user.canceledAppointments.push({
        doctor: appointment.doctor,
        date: appointment.date,
        appointment: appointmentId,
      });
      await user.save();

      res.json({ message: 'Cita cancelada exitosamente' });
    } else {
      return res.status(400).json({ message: 'La cita no está reservada' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = appointmentsController;
