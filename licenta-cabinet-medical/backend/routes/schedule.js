const express = require('express');
const ScheduleController = require('../controllers/schedule');
const CheckAuth = require('../filters/CheckAuth');

const router = express.Router();

router.post("/create", CheckAuth, ScheduleController.createSchedule);
router.get("/select", CheckAuth, ScheduleController.getMedicsAndDate);

module.exports = router;
