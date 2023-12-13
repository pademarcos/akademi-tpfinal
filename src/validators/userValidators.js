const { body } = require('express-validator');
const User = require('../models/user');

const validateRegister = (req) => {
  return [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('email').isEmail().withMessage('El correo electrónico no es válido')
  ];
};

const validateLogin = (req) => {
  return [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ];
};

const validateRecoverPassword = (req) => {
  return [
    body('email').isEmail().withMessage('El correo electrónico no es válido')
  ];
};

module.exports = { validateRegister, validateLogin, validateRecoverPassword };
