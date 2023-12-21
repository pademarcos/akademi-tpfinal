const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/recover-password', usersController.recoverPassword);
router.get('/all-users', usersController.getAllUsers);
router.get('/canceled-appointments', usersController.getCanceledAppointments);


module.exports = router;