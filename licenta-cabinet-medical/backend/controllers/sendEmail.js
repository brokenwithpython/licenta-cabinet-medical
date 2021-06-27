const nodemailer = require('nodemailer');
const Users = require('../models/user');
const UsersInfo = require('../models/userInfo');
const Medics = require('../models/medic');
const MedicsInfo = require('../models/medicInfo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');



exports.sendMessage = (req, res, next) => {

  let user = req.body;
  let email;
  let userId;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_KEY);

  if(decodedToken) {
    email = decodedToken.email;
    userId = decodedToken.userId;

    sendEmail({email: user.email, message: user.message, type: 'sendMessage', recipientEmail: email}, info => {
      console.log(info);
      res.status(200).json({
        message: 'Mesajul a fost trimis cu succes!',
        info: info
      });
    })
  }
}




exports.resetPassword = (req, res, next) => {
  let user = req.body;

  if (user.isMedic === false) {
    Users.findOne({email: user.email}).then(user => {
      console.log(user.email);
      const token = jwt.sign(
        {email: user.email, userId: user._id},
        process.env.JWT_KEY,
        {expiresIn: '15m'}
      );
      const link = req.headers.origin + req.url +  '/false/' + token;
      sendEmail({email: user.email, link: link, type: "resetPassword"}, info => {
        console.log(info);
        res.status(200).json({
          message: 'Link-ul schimbare parola a fost generat!',
          info: info
        });
      });
    }).catch(err => {
      res.status(404).json({
        message: 'Emailul specificat nu exista!',
        err: err
      });
    });
  } else {
    Medics.findOne({email: user.email}).then(medic => {
      console.log(medic.email);
      const token = jwt.sign(
        {email: medic.email, userId: medic._id},
        process.env.JWT_KEY,
        {expiresIn: '15m'}
      );
      const link = req.headers.origin + req.url +  '/true/' +token;
      sendEmail({email: medic.email, link: link, type: "resetPassword"}, info => {
        console.log(info);
        res.status(200).json({
          message: 'Link-ul schimbare parola a fost generat!',
          info: info
        });
      });
    }).catch(err => {
      res.status(404).json({
        message: 'Emailul specificat nu exista!',
        err: err
      });
    });
  }
}


exports.resetChangePassword = (req, res, next) => {
  let userData = null;
  try {
    const decodedToken = jwt.verify(req.body.token, process.env.JWT_KEY);
    userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
      isMedic: req.body.isMedic,
      password: req.body.password
    };


    bcrypt.hash(req.body.password, 10).then(hash => {

      if (userData.isMedic === 'false') {
        Users.updateOne({_id: userData.userId}, {password: hash}).then(response => {
          res.status(200).json({
            message: 'Parola a fost schimbata cu succes!',
            response: response
          });
        }).catch(err => {
          res.status(500).json({
            message: 'Link-ul a expirat sau nu este valid!',
            err: err
          });
        });
      } else {
        Medics.updateOne({_id: userData.userId}, {password: hash}).then(response => {
          res.status(200).json({
            message: 'Parola a fost schimbata cu succes!',
            response: response
          });
        }).catch(err => {
          res.status(500).json({
            message: 'Link-ul a expirat sau nu este valid!',
            err: err
          });
        });
      }
    }).catch(err => {
      res.status(500).json({
        message: 'Link-ul a expirat sau nu este valid!',
        err: err
      });
    });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Link-ul a expirat sau nu este valid!',
      err: err
    });
  }

}


async function sendEmail(user, callback) {

  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "mail.corneanu-manuel.eu",
    port: 465,
    secure: true,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: "admin-account@corneanu-manuel.eu",
      pass: "TestNodeMailer 123"
    }
  });
  let subject;
  let html;

  if (user.type === "resetPassword") {
    subject = "Solicitare resetare parola!";
    html = `<h2>Resetare parola</h2><br>
            <h3>Ati primit acest mail deoarece ati solicitat resetarea parolei!</h3><br>
            <h3>Pentru a putea schimba parola veche, faceti click pe link-ul urmator: <a href="${user.link}"> LINK Schimbare parola</a></h3><br>
            <h4>Daca nu ati solicitat resetarea parolei, ignorati pur si simplu acest mesaj.</h4>`
  } else if (user.type === "sendMessage") {
    subject = "Mesaj nou primit!";
    html = `<h2>Ati primit un mesaj nou de la ${user.recipientEmail}</h2><br>
            <h3>Mesaj: ${user.message}</h3>`;
  }

  let mailOptions = {
    from: `"Family Life"<admin-account@corneanu-manuel.eu>`,
    to: user.email,
    subject: subject,
    html: html
  };
try{
  let info = await transporter.sendMail(mailOptions);
  callback(info);
}
catch(err) {
  console.log(err);
}

}
