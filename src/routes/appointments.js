const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const appointmentsValidators = require('../validators/appointmentsValidators');

router.post('/add', appointmentsValidators.validateAddAppointment, appointmentsController.addAppointment);

module.exports = router;
