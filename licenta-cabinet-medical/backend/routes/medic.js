const express = require('express');
const MedicController = require('../controllers/medic');
const CheckAuth = require("../filters/CheckAuth");

const router = express.Router();

router.post("/sign-up", MedicController.createMedic);
router.post("/login", MedicController.loginMedic);
router.get("/getPersonalInfo", CheckAuth, MedicController.getMedicPersonalData);
router.put("/putPersonalInfo", CheckAuth, MedicController.putMedicPersonalData);

module.exports = router;
