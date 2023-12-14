const express = require('express');
const router = express.Router();
const specialitiesController = require('../controllers/specialitiesController');

// todas las especialidades
router.get('/', specialitiesController.getAllSpecialities);

// nueva especialidad (admin)
router.post('/', specialitiesController.addSpeciality);

module.exports = router;
