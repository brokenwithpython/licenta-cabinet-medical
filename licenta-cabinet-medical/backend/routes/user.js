const express = require('express');
const UserController = require('../controllers/user');
const CheckAuth = require("../filters/CheckAuth");

const router = express.Router();

router.post("/sign-up", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/getPersonalInfo", CheckAuth, UserController.getUsersPersonalData);
router.put("/putPersonalInfo", CheckAuth, UserController.putUsersPersonalData);


module.exports = router;
