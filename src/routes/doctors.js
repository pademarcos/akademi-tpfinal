const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');


// todos los médicos
router.get('/', doctorsController.getAllDoctors);

//  médico específico
router.get('/:id', doctorsController.getDoctorDetails);

// nuevo médico (admin)
router.post('/', doctorsController.addDoctor);


module.exports = router;
