const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  phoneNumber: {type: String, required: true},
  lastName: {type: String, required: true},
  firstName: {type: String, required: true},
  CNP: {type: String, required: true},
  address: {type: String, required: true},
  county: {type: String, required: true},
  profileImage: {type: String},
  userCreator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});


module.exports = mongoose.model('UserInfo', userSchema);
