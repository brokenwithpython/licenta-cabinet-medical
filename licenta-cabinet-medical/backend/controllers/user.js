const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');

const User = require('../models/user');
const UserInfo = require('../models/userInfo');


exports.createUser = (req, res, next) => {
  cnpEnc = cryptoJs.AES.encrypt(req.body.CNP, process.env.PASSPHRASE_AES).toString();
  phoneEnc = cryptoJs.AES.encrypt(req.body.phoneNumber, process.env.PASSPHRASE_AES).toString();
  addressEnc = cryptoJs.AES.encrypt(req.body.address, process.env.PASSPHRASE_AES).toString();
  countyEnc = cryptoJs.AES.encrypt(req.body.county, process.env.PASSPHRASE_AES).toString();
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result => {
      const userInfo = new UserInfo({
        email: req.body.email,
        phoneNumber: phoneEnc,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        CNP: cnpEnc,
        address: addressEnc,
        county: countyEnc,
        userCreator: result._id
      });
      userInfo.save().then(result => {
        return res.status(201).json({
          message: "User created!",
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

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({
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
      isMedic: 'false'
    })
  }).catch(err => {
    return res.status(500).json({
      message: "Login Failed!"
    });
  });
}
