const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); 

const usersController = {};

usersController.register = async (req, res, next) => {
  try {

    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role
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

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, 'palabrasupersecreta', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// Recuperar contraseña
usersController.recoverPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    res.json({ message: 'Se ha enviado un correo electrónico para restablecer la contraseña' });
  } catch (error) {
    next(error);
  }
};

module.exports = usersController;
