const { body } = require('express-validator');
const moment = require('moment');

const validateAddAppointment = () => {
  return [
    body('doctor').notEmpty().withMessage('El campo doctor es obligatorio'),
    body('date')
      .notEmpty().withMessage('El campo fecha es obligatorio')
      .custom((value) => {
        const now = moment();
        const selectedDate = moment(value);

        if (!selectedDate.isValid() || selectedDate.isBefore(now)) {
          throw new Error('La fecha seleccionada es inválida');
        }

        const isWeekend = selectedDate.isoWeekday() > 5;
        if (isWeekend) {
          throw new Error('No se pueden programar turnos para el fin de semana');
        }

        const startOfDay = moment(value).startOf('day');
        const endOfDay = moment(value).endOf('day');
        const workingHoursStart = moment(value).set('hour', 8).set('minute', 0).set('second', 0);
        const workingHoursEnd = moment(value).set('hour', 18).set('minute', 0).set('second', 0);

        if (
          selectedDate.isBefore(startOfDay) ||
          selectedDate.isAfter(endOfDay) ||
          selectedDate.isBefore(workingHoursStart) ||
          selectedDate.isAfter(workingHoursEnd)
        ) {
          throw new Error('Los turnos solo están disponibles de lunes a viernes de 08:00 a 18:00');
        }

        return true;
      }),
  ];
};

module.exports = { validateAddAppointment };
