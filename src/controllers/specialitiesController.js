const Speciality = require('../models/speciality');
//const { validationResult } = require('express-validator');

const specialitiesController = {};

specialitiesController.getAllSpecialities = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const totalSpecialities = await Speciality.countDocuments();
    const totalPages = Math.ceil(totalSpecialities / pageSize);
    const skip = (page - 1) * pageSize;

    const specialities = await Speciality.find()
      .skip(skip)
      .limit(pageSize)
      .exec();

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.json({
      specialities: {
        data: specialities,
        pageInfo: {
          total: totalSpecialities,
          totalPages,
          currentPage: page,
          hasNextPage,
          hasPreviousPage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

specialitiesController.addSpeciality = async (req, res, next) => {
  try {

    const { name } = req.body;

    const existingSpeciality = await Speciality.findOne({ name });
    if (existingSpeciality) {
      return res.status(422).json({ message: 'La especialidad ya existe' });
    }

    const newSpeciality = new Speciality({
      name,
    });

    await newSpeciality.save();

    res.status(201).json({ message: 'Especialidad añadida exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = specialitiesController;
