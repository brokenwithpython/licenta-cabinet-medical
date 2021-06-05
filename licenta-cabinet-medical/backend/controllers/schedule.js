const Schedule = require('../models/schedule');
const Medics = require('../models/medicInfo');
const cryptoJs = require('crypto-js');

exports.createSchedule = (req, res, next) => {
  console.log(req.body);
  const schedule = new Schedule({
    dataAndHour: req.body.dataAndHour,
    address: req.body.address,
    problem: req.body.problem,
    // medicId: req.body.medicId,
    userId: req.userData.userId
  });
  schedule.save().then(createdSchedule => {
    console.log(createdSchedule);
    res.status(201).json({
      message:"Schedule created successfully!",
      post: {
        id: createdSchedule._id,
        ...createdSchedule
      }
    });
  }).catch(error => {
    // console.log(error);
    res.status(500).json({
      message: error
    });
  });
};

exports.getMedicsAndDate = (req, res, next) => {
  let options = [];
  medicDocuments = Medics.find().then(medicDocuments => {
    console.log(medicDocuments);
    for(let doc of medicDocuments) {
      specializationDec = cryptoJs.AES.decrypt(doc.specialization, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      judetDec = cryptoJs.AES.decrypt(doc.county, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
      if(req.query.problema === specializationDec &&
        req.query.judet === judetDec) {
          optionMedic = {
            firstName: doc.firstName,
            lastName: doc.lastName,
            judet: judetDec,
            specialization: specializationDec
          };
          options.push(optionMedic);
      }
    }
    res.status(200).json({
      message: "Toate programarile",
      options: options
    });
  }).catch(error => {
    res.status(404).json({
      message: "Error not found!",
      error: error
    });
  });
}
