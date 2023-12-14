const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specialitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Speciality = mongoose.model('Speciality', specialitySchema);

module.exports = Speciality;
