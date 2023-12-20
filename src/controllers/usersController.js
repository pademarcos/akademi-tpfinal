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
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateAuthToken(user);
    console.log(token)

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
    // Obtener todos los usuarios desde la base de datos
    const allUsers = await User.find({}, '-password'); //sin contraseña

    res.json(allUsers);
  } catch (error) {
    next(error);
  }
};

usersController.getCanceledAppointments = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).populate('canceledAppointments');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user.canceledAppointments);
  } catch (error) {
    next(error);
  }
};

const verifyAdminPermissions = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', ''); // Obtén el token del encabezado
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
  }
  
  try {
    const decoded = jwt.verify(token, 'SECRET'); // Verifica el token
    req.user = decoded; // Almacena la información del usuario en el objeto de solicitud

    // Verifica si el usuario es administrador
    const isAdmin = req.user && req.user.admin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'Acceso no autorizado. Se requieren permisos de administrador.' });
    }

    next(); // Continúa con la ejecución si el usuario es administrador
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido.' });
  }
};

module.exports = {usersController, verifyAdminPermissions};
