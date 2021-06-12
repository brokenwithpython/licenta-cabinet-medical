const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');

const User = require('../models/user');
const UserInfo = require('../models/userInfo');
const deleteFile = require('fs');
const schedule = require('../models/schedule');
const path = require('path');


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
          message: "Email sau CNP deja folosite!"
        });
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: "Email sau CNP deja folosite!"
      });
    });
  }).catch(err => {
    return res.status(500).json({
      message: "Eroare interna! Va rugam sa reincercati!"
    });
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

exports.getUsersPersonalData = (req, res, next) => {
  Users = UserInfo.find({userCreator: req.query.userId}).then(user =>{
    user = user[0];
    filePath = '';
    try {
      phoneNumberDec = cryptoJs.AES.decrypt(user.phoneNumber, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      CNPDec = cryptoJs.AES.decrypt(user.CNP, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      countyDec = cryptoJs.AES.decrypt(user.county, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      addressDec = cryptoJs.AES.decrypt(user.address, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      if(user.profileImage) {
        pathDec = cryptoJs.AES.decrypt(user.profileImage, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
        filePath = pathDec;
      }
    }
    catch(err) {
      console.log(err);
    }
    res.status(200).json({
      message: "Informatiile personale",
      personalData: {
        phoneNumber: phoneNumberDec,
        CNP: CNPDec,
        county: countyDec,
        address: addressDec,
        firstName: user.firstName,
        lastName: user.lastName,
        imagePath: filePath
      }
    });
  }).catch(err => {
    return res.status(404).json({
      message: "Could not find your user in our DataBase!",
      err: err
    });
  });
}

exports.putUsersPersonalData = (req, res, next) => {
  cnpEnc = cryptoJs.AES.encrypt(req.body.CNP, process.env.PASSPHRASE_AES).toString();
  phoneEnc = cryptoJs.AES.encrypt(req.body.phoneNumber, process.env.PASSPHRASE_AES).toString();
  addressEnc = cryptoJs.AES.encrypt(req.body.address, process.env.PASSPHRASE_AES).toString();
  countyEnc = cryptoJs.AES.encrypt(req.body.county, process.env.PASSPHRASE_AES).toString();
  UserInfo.updateOne({userCreator: req.body.userId},
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


exports.uploadProfilePhoto = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  imageFinalPath = url + '/profileImages/' + req.file.filename;
  imageFinalPathEnc = cryptoJs.AES.encrypt(imageFinalPath, process.env.PASSPHRASE_AES).toString();
  UserInfo.findOne({userCreator: req.body.id}).then(user => {
    if(user.profileImage) {
      pathDec = cryptoJs.AES.decrypt(user.profileImage, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      console.log(pathDec);
      deleteFile.unlink('backend/' + pathDec.split('http://localhost:3000/')[1] ,(result => {
        console.log(result)
      }));
    }
    UserInfo.updateOne({userCreator: req.body.id}, {profileImage: imageFinalPathEnc}).then(response => {
      res.status(200).json({
        message: "Imaginea a fost incarcata cu succes!",
        response: response
      })
    }).catch(err => {
      res.status(500).json({
        message: "Eroare la incarcare",
        err: err
      });
    });
  });
}

exports.downloadImage = (req, res, next) => {
  UserInfo.findOne({userCreator: req.query.userId}).then(user => {
    if(user.profileImage !== '' || user.profileImage !== null) {
      pathDec = cryptoJs.AES.decrypt(user.profileImage, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      filePath = path.join(__dirname, '../profileImages/') + pathDec.split('http://localhost:3000/backend/profileImages/')[1];
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        message: "Nu exista poza de profil!"
      })
    }

  });
}
