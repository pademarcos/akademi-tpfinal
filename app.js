const express = require('express');
const mongoose = require('mongoose');
const app = express();
const usersRoute = require('./src/routes/users');
const doctorsRoute = require('./src/routes/doctors');
const specialitiesRoute = require('./src/routes/specialities');

//settings
app.set('port', process.env.PORT || 3000);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/users', usersRoute);
app.use('/api/doctors', doctorsRoute);
app.use('/api/specialities', specialitiesRoute);

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });

module.exports = app
