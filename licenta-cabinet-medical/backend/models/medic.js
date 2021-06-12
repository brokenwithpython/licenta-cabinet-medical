const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const medicSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

medicSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Medic', medicSchema);
