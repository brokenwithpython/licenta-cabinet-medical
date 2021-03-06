const Schedule = require('../models/schedule');
const Medics = require('../models/medicInfo');
const Users = require('../models/userInfo');
const cryptoJs = require('crypto-js');
// const medic = require('../models/medic');

exports.createSchedule = (req, res, next) => {
  const schedule = new Schedule({
    date: req.body.date,
    hour: req.body.hour,
    address: req.body.address,
    problem: req.body.problem,
    onlineSchedule: req.body.onlineSchedule,
    note: '',
    contraindicatii: '',
    indicatii: '',
    pdfPaths: [],
    medicId: req.body.medicId,
    userId: req.userData.userId
  });
  schedule.save().then(createdSchedule => {
    res.status(201).json({
      message:"Schedule created successfully!",
      post: {
        id: createdSchedule._id,
        ...createdSchedule
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: error
    });
  });
};

exports.addInfoForSchedule = (req, res, next) => {
  noteEnc = cryptoJs.AES.encrypt(req.body.note, process.env.PASSPHRASE_AES).toString();
  contraindicatiiEnc = cryptoJs.AES.encrypt(req.body.contraindicatii, process.env.PASSPHRASE_AES).toString();
  indicatiiEnc = cryptoJs.AES.encrypt(req.body.indicatii, process.env.PASSPHRASE_AES).toString();

  Schedule.updateOne({_id: req.body._id}, {
    note: noteEnc,
    contraindicatii: contraindicatiiEnc,
    indicatii: indicatiiEnc
  }).then(result => {
    res.status(201).json({
      text: "Am adaugat informatiile cu succes!",
      output: result
    });
  }).catch(err => {
    res.status(500).json({
      message: err
    });
  })
}

exports.getSchedulesForUsers = (req, res, next) => {
  let scheduleRespone = [];
  medics = Medics.find();
  Schedule.find().then(scheduleDoc => {
    usersSchedules = scheduleDoc.filter(schedule => {
      return schedule.userId.toString() === req.query.userId.toString()
    })

    Medics.find().then(medics => {
    usersSchedules.forEach(schedule => {
      medics.forEach(medic => {
        if (medic.userCreator.toString() === schedule.medicId.toString()) {
            phoneNumberDec = cryptoJs.AES.decrypt(medic.phoneNumber, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
            noteDec = cryptoJs.AES.decrypt(schedule.note, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
            contraindicatiiDec = cryptoJs.AES.decrypt(schedule.contraindicatii, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
            indicatiiDec = cryptoJs.AES.decrypt(schedule.indicatii, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
            pdfPaths = schedule.pdfPaths;
            finalPaths = [];
            pdfPaths.forEach(path => {
              encPath = cryptoJs.AES.decrypt(path, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
              finalPaths.push('http://localhost:3000/' + 'backend/' + encPath.split('http://localhost:3000/')[1]);
            })
            scheduleRespone.push({
              _id : schedule._id,
              date: schedule.date,
              hour: schedule.hour,
              address: schedule.address,
              problem: schedule.problem,
              medicId: schedule.medicId,
              userId: schedule.userId,
              note: noteDec,
              contraindicatii: contraindicatiiDec,
              indicatii: indicatiiDec,
              pdfPaths: schedule.pdfPaths,
              onlineSchedule: schedule.onlineSchedule,
              medicLastName: medic.lastName,
              medicFirstName: medic.firstName,
              phoneNumber: phoneNumberDec,
              email: medic.email,
              pdfPaths: finalPaths
            });
          }
        })
      });
      res.status(200).json({
        message: "Toate programarile",
        schedules: scheduleRespone
      });
    });
  }).catch(err => {
    res.status(404).json({
      message: "Eroare",
      err: err
    });
  });
}

exports.getSchedulesForMedics = (req, res, next) => {
  let scheduleResponse = [];
  Schedule.find().then(scheduleDoc => {
    medicsSchedules = scheduleDoc.filter(schedule => {
      return schedule.medicId.toString() === req.query.medicId.toString()
    });

    Users.find().then(users => {
      medicsSchedules.forEach(schedule => {
        users.forEach(user => {
          if(user.userCreator.toString() === schedule.userId.toString()){
            phoneNumberDec = cryptoJs.AES.decrypt(user.phoneNumber, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
            noteDec = cryptoJs.AES.decrypt(schedule.note, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
            contraindicatiiDec = cryptoJs.AES.decrypt(schedule.contraindicatii, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
            indicatiiDec = cryptoJs.AES.decrypt(schedule.indicatii, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
            pdfPaths = schedule.pdfPaths;
            finalPaths = [];
            pdfPaths.forEach(path => {
              encPath = cryptoJs.AES.decrypt(path, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
              finalPaths.push('http://localhost:3000/' + 'backend/' + encPath.split('http://localhost:3000/')[1]);
            })
            scheduleResponse.push({
              _id : schedule._id,
              date: schedule.date,
              hour: schedule.hour,
              address: schedule.address,
              problem: schedule.problem,
              medicId: schedule.medicId,
              userId: schedule.userId,
              note: noteDec,
              contraindicatii: contraindicatiiDec,
              indicatii: indicatiiDec,
              pdfPaths: schedule.pdfPaths,
              onlineSchedule: schedule.onlineSchedule,
              userName: user.lastName + " " + user.firstName,
              phoneNumber: phoneNumberDec,
              email: user.email,
              pdfPaths: finalPaths
            });
          }
        })
      });
      res.status(200).json({
        message: "Toate programarile",
          schedules: scheduleResponse
        });
    })

  }).catch(err => {
    res.status(404).json({
      message: "Eroare",
      err: err
    });
  });
}

exports.deleteSchedule = (req, res, next) => {
  Schedule.deleteOne({_id: req.query.scheduleId}).then(response => {
  });
}

exports.getMedicsAndDate = (req, res, next) => {
  let options = [];
  let index = 0;
  finalDate = new Date(req.query.date);
  finalDate =  finalDate.getDate().toString() + ' ' +
              (finalDate.getMonth()+1).toString() + ' ' +  finalDate.getFullYear().toString();
  medicDocuments = Medics.find().then(medicDocuments => {
    scheduleDocuments = Schedule.find().then( scheduleDocuments => {
      for(let doc of medicDocuments) {
        specializationDec = cryptoJs.AES.decrypt(doc.specialization, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
        judetDec = cryptoJs.AES.decrypt(doc.county, process.env.PASSPHRASE_AES).toString(cryptoJs.enc.Utf8);
        hours = [];
        for(let scDoc of scheduleDocuments) {
          if (doc.userCreator.toString() === scDoc.medicId.toString() &&  finalDate === scDoc.date) {
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
              medicId: doc.userCreator,
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
            medicId: doc.userCreator,
            cardId: index
          };
          index++;
          options.push(optionMedic);
        }
      }
      res.status(200).json({
        message: "Toate optiunile pentru programare!",
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
