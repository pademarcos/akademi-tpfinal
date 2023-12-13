const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user'); 
const { validationResult } = require('express-validator');
const userValidators = require('../validators/userValidators');

const usersController = {};

const generateAuthToken = (user) => {
  return jwt.sign({ userId: user._id, username: user.username, admin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

usersController.register = async (req, res, next) => {
  try {
        // Validar los datos del usuario
        userValidators.validateRegister(req);

        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        const { username, password, email } = req.body;

            // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(422).json({ message: 'El usuario ya se registró anteriormente' });
        }

            // Verificar si el correo electrónico ya existe
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(422).json({ message: 'El correo electrónico ya se registró anteriormente' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          username,
          password: hashedPassword,
          email
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    next(error);
  }
};

// Iniciar sesión y obtener token JWT
usersController.login = async (req, res, next) => {
  try {
        // Validar los datos del usuario
        userValidators.validateLogin(req);

        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateAuthToken(user);
console.log(user);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// Recuperar contraseña
usersController.recoverPassword = async (req, res, next) => {
  try {
        // Validar los datos del usuario
        userValidators.validateRecoverPassword(req);

        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
    const { email } = req.body;
        //  lógica para enviar el correo electrónico de recuperación de contraseña con nodemailer

    res.json({ message: 'Se ha enviado un correo electrónico para restablecer la contraseña' });
  } catch (error) {
    next(error);
  }
};

module.exports = usersController;
