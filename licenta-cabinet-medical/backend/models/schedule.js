const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const scheduleSchema = mongoose.Schema({
  date: {type: String, required: true},
  hour: {type: String, required: true},
  address: {type: String, required: true},
  problem: {type: String, required: true},
  onlineSchedule: {type: Boolean, required: true},
  note: {type: String},
  contraindicatii: {type: String},
  indicatii: {type: String},
  pdfPaths: {type: Array},
  medicId: {type: mongoose.Schema.Types.ObjectId, ref: "Medic", required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});


module.exports = mongoose.model('Schedule', scheduleSchema);
