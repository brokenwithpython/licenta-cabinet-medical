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

exports.getMedicPersonalData = (req, res, next) => {
  Medics = MedicInfo.find({userCreator: req.query.userId}).then(medic =>{
    medic = medic[0];
    try {
      phoneNumberDec = cryptoJs.AES.decrypt(medic.phoneNumber, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      CNPDec = cryptoJs.AES.decrypt(medic.CNP, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      countyDec = cryptoJs.AES.decrypt(medic.county, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      addressDec = cryptoJs.AES.decrypt(medic.address, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
    }
    catch(err) {
      console.log(err);
    }
    res.status(200).json({
      message: "Informatiile personale",
      personalData: [phoneNumberDec, CNPDec, countyDec, addressDec, medic.firstName, medic.lastName]
    });
  }).catch(err => {
    return res.status(404).json({
      message: "Could not find your user in our DataBase!",
      err: err
    });
  });
}

exports.putMedicPersonalData = (req, res, next) => {
  cnpEnc = cryptoJs.AES.encrypt(req.body.CNP, process.env.PASSPHRASE_AES).toString();
  phoneEnc = cryptoJs.AES.encrypt(req.body.phoneNumber, process.env.PASSPHRASE_AES).toString();
  addressEnc = cryptoJs.AES.encrypt(req.body.address, process.env.PASSPHRASE_AES).toString();
  countyEnc = cryptoJs.AES.encrypt(req.body.county, process.env.PASSPHRASE_AES).toString();
  MedicInfo.updateOne({userCreator: req.body.userId},
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: phoneEnc,
            CNP: cnpEnc,
            address: addressEnc,
            county: countyEnc})
    .then(output => {
      // console.log(output);
      return res.status(200).json({
        message: "Informatiile personale au fost modificate cu succes!"
      });
    })
}
