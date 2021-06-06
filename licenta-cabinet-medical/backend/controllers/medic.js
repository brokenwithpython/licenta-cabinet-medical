const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');

const Medic = require('../models/medic');
const MedicInfo = require('../models/medicInfo');


exports.createMedic = (req, res, next) => {
  cnpEnc = cryptoJs.AES.encrypt(req.body.CNP, process.env.PASSPHRASE_AES).toString();
  phoneEnc = cryptoJs.AES.encrypt(req.body.phoneNumber, process.env.PASSPHRASE_AES).toString();
  addressEnc = cryptoJs.AES.encrypt(req.body.address, process.env.PASSPHRASE_AES).toString();
  countyEnc = cryptoJs.AES.encrypt(req.body.county, process.env.PASSPHRASE_AES).toString();
  specializationEnc = cryptoJs.AES.encrypt(req.body.specialization, process.env.PASSPHRASE_AES).toString();
  bcrypt.hash(req.body.password, 10).then(hash => {
    const medic = new Medic({
      email: req.body.email,
             password: hash
    });
    medic.save()
    .then(result => {
      const medicInfo = new MedicInfo({
        email: req.body.email,
        phoneNumber: phoneEnc,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        CNP: cnpEnc,
        county: countyEnc,
        address: addressEnc,
        specialization: specializationEnc,
        userCreator: result._id
      });
      medicInfo.save().then(result => {
        return res.status(201).json({
          message: "Medic created!",
          result: result
        });
      }).catch(err => {
        console.log(err);
        return res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: "Invalid authentication credentials!"
      });
    });
  }).catch(err => {
    console.log(err);
  });
}

exports.loginMedic = (req, res, next) => {
  let fetchedUser;
  Medic.findOne({
    email: req.body.email
  }).then(user => {
    if(!user) {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    }
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      process.env.JWT_KEY,
      {expiresIn: "1h"}
    );
    return res.status(200).json({
      token: token,
      userId: fetchedUser._id,
      expiresIn: 3600,
      isMedic: 'true'
    })
  }).catch(err => {
    return res.status(500).json({
      message: "Login Failed!"
    });
  });
}
