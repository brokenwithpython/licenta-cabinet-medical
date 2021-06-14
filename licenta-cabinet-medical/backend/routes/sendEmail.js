const express = require('express');
const sendEmailController = require('../controllers/sendEmail');


const router = express.Router();

router.post('/resetPassword', sendEmailController.resetPassword);
router.post('/resetChangePassword', sendEmailController.resetChangePassword);

module.exports = router;
