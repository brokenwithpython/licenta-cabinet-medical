const express = require('express');
const MedicController = require('../controllers/medic');
const CheckAuth = require("../filters/CheckAuth");
const ScheduleController = require('../controllers/schedule');
const imageFilter = require('../filters/images');

const router = express.Router();

router.post("/sign-up", MedicController.createMedic);
router.post("/login", MedicController.loginMedic);
router.get("/getPersonalInfo", CheckAuth, MedicController.getMedicPersonalData);
router.put("/putPersonalInfo", CheckAuth, MedicController.putMedicPersonalData);
router.get("/my-schedule", CheckAuth, ScheduleController.getSchedulesForMedics);
router.post("/uploadProfilePhoto", CheckAuth, imageFilter, MedicController.uploadProfilePhoto);

module.exports = router;
