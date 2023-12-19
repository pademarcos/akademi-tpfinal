const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');
const { verifyAdminPermissions } = require('../controllers/usersController');


// todos los médicos
router.get('/', doctorsController.getAllDoctors);

//  médico específico
router.get('/:id', doctorsController.getDoctorDetails);

// nuevo médico (admin)
router.post('/', verifyAdminPermissions, doctorsController.addDoctor);

// actualizar médico (admin)
router.put('/:id', verifyAdminPermissions, doctorsController.updateDoctor); 



module.exports = router;
