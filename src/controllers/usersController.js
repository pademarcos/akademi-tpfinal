const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user'); 
const { validationResult } = require('express-validator');
const userValidators = require('../validators/userValidators');

const usersController = {};
//const secretKey = process.env.SECRET
//console.log(secretKey)

const generateAuthToken = (user) => {
  //console.log(user)
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      admin: user.isAdmin,
      dni: user.dni,
    },
    "SECRET",
    { expiresIn: '72h' }
  );
};

usersController.register = async (req, res, next) => {
  try {
        userValidators.validateRegister(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        const { username, password, email, dni, isAdmin } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(422).json({ message: 'El usuario ya se registró anteriormente' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(422).json({ message: 'El correo electrónico ya se registró anteriormente' });
        }

        const existingDNI = await User.findOne({ dni });
        if (existingDNI) {
          return res.status(422).json({ message: 'El DNI ya se registró anteriormente' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          username,
          password: hashedPassword,
          email,
          dni,
          isAdmin,
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
        userValidators.validateLogin(req);
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

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// Recuperar contraseña
usersController.recoverPassword = async (req, res, next) => {
  try {
        userValidators.validateRecoverPassword(req);
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

usersController.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({}, '-password'); 

    res.json(allUsers);
  } catch (error) {
    next(error);
  }
};

usersController.getCanceledAppointments = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate('canceledAppointments');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user.canceledAppointments);
  } catch (error) {
    next(error);
  }
};

const verifyAdminPermissions = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', ''); 
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET'); 
    req.user = decoded; 

    const isAdmin = req.user && req.user.admin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'Acceso no autorizado. Se requieren permisos de administrador.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido.' });
  }
};

module.exports = {usersController, verifyAdminPermissions};
