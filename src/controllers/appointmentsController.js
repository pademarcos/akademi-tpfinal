const Appointment = require('../models/appointment');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const appointmentsController = {};

appointmentsController.addAppointment = async (req, res, next) => {
  try {
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

appointmentsController.updateAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { appointmentId, newDoctor, newDate } = req.body;

    if (!newDoctor && !newDate) {
      return res.status(400).json({ message: 'Se requiere al menos un nuevo médico o una nueva fecha' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    if (appointment.isReserved) {
      return res.status(400).json({ message: 'No se puede actualizar un turno reservado' });
    }    

    if (newDoctor) {
      appointment.doctor = newDoctor;
    }

    if (newDate) {
      appointment.date = newDate;
    }

    await appointment.save();

    res.json({ message: 'Cita actualizada exitosamente' });
  } catch (error) {
    next(error);
  }
};

appointmentsController.reserveAppointment = async (req, res, next) => {
  try {
    const { appointmentId, userId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    if (appointment.isReserved || appointment.isCanceled) {
      return res.status(400).json({ message: 'La cita no está disponible para reserva' });
    }

    appointment.isReserved = true;
    appointment.patient = userId; 

    await appointment.save();

    res.json({ message: 'Cita reservada exitosamente' });
  } catch (error) {
    next(error);
  }
};

appointmentsController.cancelAppointment = async (req, res, next) => {
  try {
    const { appointmentId, userId } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate('doctor');
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    if (appointment.isReserved) {
      appointment.isReserved = false;
      appointment.patient = null; 

      await appointment.save();

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

appointmentsController.listAppointmentsByPatient = async (req, res, next) => {
  try {
    const { userId } =  req.params;

    if (!userId) {
      return res.status(400).json({ message: 'Se requiere el userId para listar los turnos del paciente' });
    }
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const skip = (page - 1) * pageSize;

    const totalAppointments = await Appointment.countDocuments({ patient: userId });
    const totalPages = Math.ceil(totalAppointments / pageSize);

    const appointments = await Appointment.find({ patient: userId })
    .skip(skip)
    .limit(pageSize)
    .exec();

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const response = {
    appointments,
    pageInfo: {
      total: totalAppointments,
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

appointmentsController.deleteAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    if (appointment.isReserved) {
      return res.status(400).json({ message: 'No se puede eliminar un turno reservado' });
    }

    await Appointment.findByIdAndDelete(appointmentId);

    res.json({ message: 'Turno eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

appointmentsController.listAppointmentsByDoctor = async (req, res, next) => {
  try {
    const { doctorId } =  req.params;

    if (!doctorId) {
      return res.status(400).json({ message: 'Se requiere el doctorId para listar los turnos segun el doctor' });
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const skip = (page - 1) * pageSize;

    const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });
    const totalPages = Math.ceil(totalAppointments / pageSize);

    const appointments = await Appointment.find({ doctor: doctorId })
    .skip(skip)
    .limit(pageSize)
    .exec();

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const response = {
    appointments,
    pageInfo: {
      total: totalAppointments,
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

module.exports = appointmentsController;
