const Schedule = require('../models/schedule');
const Medics = require('../models/medicInfo');
const cryptoJs = require('crypto-js');
const { doesIntersect } = require('tslint');

exports.createSchedule = (req, res, next) => {
  console.log(req.body);
  const schedule = new Schedule({
    date: req.body.date,
    hour: req.body.hour,
    address: req.body.address,
    problem: req.body.problem,
    medicId: req.body.medicId,
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
    console.log(error);
    res.status(500).json({
      message: error
    });
  });
};

exports.getMedicsAndDate = (req, res, next) => {
  let options = [];
  let index = 0;
  finalDate = new Date(req.query.date);
  finalDate =  finalDate.getDate().toString() + ' ' +
              (finalDate.getMonth()+1).toString() + ' ' +  finalDate.getFullYear().toString();
  // console.log(finalDate)
  medicDocuments = Medics.find().then(medicDocuments => {
    scheduleDocuments = Schedule.find().then( scheduleDocuments => {
      for(let doc of medicDocuments) {
        specializationDec = cryptoJs.AES.decrypt(doc.specialization, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
        judetDec = cryptoJs.AES.decrypt(doc.county, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
        hours = [];
        for(let scDoc of scheduleDocuments) {
          if (doc._id.toString() === scDoc.medicId.toString() &&  finalDate === scDoc.date) {
            hours.push(scDoc.hour);
          }
        }
        if(req.query.problema === specializationDec && req.query.consultatieOnline === 'true') {
            optionMedic = {
              address: req.query.judet,
              date: finalDate,
              firstName: doc.firstName,
              lastName: doc.lastName,
              judet: judetDec,
              specialization: specializationDec,
              hoursToExclude: hours,
              medicId: doc._id,
              cardId: index
            };
            index++;
            options.push(optionMedic);
        } else if (req.query.problema === specializationDec && req.query.consultatieOnline === 'false' && req.query.judet === judetDec) {
          optionMedic = {
            address: req.query.judet,
            date: finalDate,
            firstName: doc.firstName,
            lastName: doc.lastName,
            judet: judetDec,
            specialization: specializationDec,
            hoursToExclude: hours,
            medicId: doc._id,
            cardId: index
          };
          index++;
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
    })
}
