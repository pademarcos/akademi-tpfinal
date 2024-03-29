const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');
const usersController = require('../controllers/usersController');


// todos los médicos
router.get('/', doctorsController.getAllDoctors);

//  médico específico
router.get('/:id', doctorsController.getDoctorDetails);

// Detalle del médico con sus turnos
router.get('/details/:id', doctorsController.getDoctorWithAppointments);

// nuevo médico (admin)
router.post('/', usersController.verifyAdminPermissions, doctorsController.addDoctor);

// actualizar médico (admin)
router.put('/:id', usersController.verifyAdminPermissions, doctorsController.updateDoctor); 

//doctor por especialidad
router.get('/speciality/:specialityName', doctorsController.getDoctorsBySpeciality);


module.exports = router;
