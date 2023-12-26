const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const appointmentsValidators = require('../validators/appointmentsValidators');
const usersController = require('../controllers/usersController');

router.get('/listByPatient/:userId', appointmentsController.listAppointmentsByPatient);
router.get('/listByDoctor/:doctorId', appointmentsController.listAppointmentsByDoctor);
router.post('/add', appointmentsValidators.validateAddAppointment(), appointmentsController.addAppointment);
router.put('/reserve/', appointmentsController.reserveAppointment);
router.put('/cancel/', appointmentsController.cancelAppointment);
router.put('/update/', usersController.verifyAdminPermissions, appointmentsValidators.validateUpdateAppointment(), appointmentsController.updateAppointment);
router.delete('/delete/:appointmentId', usersController.verifyAdminPermissions, appointmentsController.deleteAppointment);

module.exports = router;
