const express = require('express');
const UserController = require('../controllers/user');
const CheckAuth = require("../filters/CheckAuth");
const imageFilter = require("../filters/images");
const ScheduleController = require('../controllers/schedule')

const router = express.Router();

router.post("/sign-up", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/getPersonalInfo", CheckAuth, UserController.getUsersPersonalData);
router.put("/putPersonalInfo", CheckAuth, UserController.putUsersPersonalData);
router.post("/uploadProfilePhoto", CheckAuth, imageFilter, UserController.uploadProfilePhoto);
router.get("/my-schedule", CheckAuth, ScheduleController.getSchedulesForUsers);
module.exports = router;
