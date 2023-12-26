const { body } = require('express-validator');

const validateRegister = () => {
  return [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('email').isEmail().withMessage('El correo electrónico no es válido'),
    body('dni').notEmpty().withMessage('El DNI es obligatorio').isNumeric().withMessage('El DNI debe contener solo números')
  ];
};

const validateLogin = () => {
  return [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ];
};

const validateRecoverPassword = () => {
  return [
    body('email').isEmail().withMessage('El correo electrónico no es válido')
  ];
};

module.exports = { validateRegister, validateLogin, validateRecoverPassword };
