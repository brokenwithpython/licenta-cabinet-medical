const express = require('express');
const ScheduleController = require('../controllers/schedule');
const CheckAuth = require('../filters/CheckAuth');

const router = express.Router();

router.post("/create", CheckAuth, ScheduleController.createSchedule);
router.get("/select", CheckAuth, ScheduleController.getMedicsAndDate);
router.get("/user/my-schedules", CheckAuth, ScheduleController.getSchedulesForUsers);
router.get("/medic/my-schedules", CheckAuth, ScheduleController.getSchedulesForMedics);
router.delete("/delete-schedule", CheckAuth, ScheduleController.deleteSchedule);
router.put('/add-info', CheckAuth, ScheduleController.addInfoForSchedule);

module.exports = router;
