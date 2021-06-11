const Schedule = require('../models/schedule');
const cryptoJs = require('crypto-js');
const path = require('path');


exports.uploadPdf = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const pdfFinalPath = url + '/pdfFiles/' + req.file.filename;
  pdfFinalPathEnc = cryptoJs.AES.encrypt(pdfFinalPath, process.env.PASSPHRASE_AES).toString();
  Schedule.findById(req.body.id).then(file => {
    let pdfPaths = [];
    pdfPaths.push(...file.pdfPaths);
    pdfPaths.push(pdfFinalPathEnc);
    Schedule.updateOne({_id: req.body.id}, {pdfPaths: pdfPaths}).then(response => {
      res.status(200).json({
        message: "Imiaginea a fost incarcata cu succes!",
        response: response
      });
    }).catch(err => {
      res.status(500).json({
        message: "Eroare la incarcare",
        err: err
      });
    });

  })
  };

  exports.downloadPdf = (req, res, next) => {
    filePath = path.join(__dirname, '../pdfFiles/') + req.query.filePath;
    // console.log(req.query.filePath);
    res.sendFile(filePath);
  }
