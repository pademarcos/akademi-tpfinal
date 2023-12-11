const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Rutas relacionadas con usuarios

// Registrar un nuevo usuario (admin o paciente)
router.post('/register', usersController.register);

// Iniciar sesión y obtener token JWT
router.post('/login', usersController.login);

// Recuperar contraseña
router.post('/recover-password', usersController.recoverPassword);

module.exports = router;