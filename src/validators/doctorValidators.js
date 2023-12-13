const { body } = require('express-validator');

const validateAddDoctor = (req) => {
  return [
    body('name').notEmpty().withMessage('El nombre del médico es obligatorio'),
    body('speciality').notEmpty().withMessage('La especialidad del médico es obligatoria'),
  ];
};

module.exports = validateAddDoctor;
