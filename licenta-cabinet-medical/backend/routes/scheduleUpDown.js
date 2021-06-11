const express = require('express');
const CheckAuth = require('../filters/CheckAuth');
const scheduleUpDownController = require('../controllers/scheduleUpDown')
const pdfFilter = require ('../filters/files');
const router = express.Router();

router.post('/uploadPdf', CheckAuth, pdfFilter, scheduleUpDownController.uploadPdf);
router.get('/downloadPdf', CheckAuth, scheduleUpDownController.downloadPdf);

module.exports = router;
