const express = require('express');
const mongoose = require('mongoose');
const app = express();
const usersRoute = require('./src/routes/users');

//settings
app.set('port', process.env.PORT || 3000);
const PORT = app.get('port');
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on port ${PORT}`);
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/users', usersRoute);

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });

module.exports = app