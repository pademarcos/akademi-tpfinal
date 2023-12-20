const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },
  isReserved: {
    type: Boolean,
    default: false,
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
