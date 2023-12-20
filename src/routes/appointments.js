const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const appointmentsValidators = require('../validators/appointmentsValidators');
const { verifyAdminPermissions } = require('../controllers/usersController');

router.get('/listByPatient', appointmentsController.listAppointmentsByPatient);
router.post('/add', appointmentsValidators.validateAddAppointment(), appointmentsController.addAppointment);
router.put('/reserve/', appointmentsController.reserveAppointment);
router.put('/cancel/', appointmentsController.cancelAppointment);
router.put('/update/', verifyAdminPermissions, appointmentsController.updateAppointment);
router.delete('/delete/:appointmentId', verifyAdminPermissions, appointmentsController.deleteAppointment);


module.exports = router;
