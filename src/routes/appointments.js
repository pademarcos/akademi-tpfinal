const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const appointmentsValidators = require('../validators/appointmentsValidators');

router.post('/add', appointmentsValidators.validateAddAppointment(), appointmentsController.addAppointment);
router.put('/reserve/', appointmentsController.reserveAppointment);
router.put('/cancel/', appointmentsController.cancelAppointment);


module.exports = router;
