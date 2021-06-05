const express = require('express');
const MedicController = require('../controllers/medic');

const router = express.Router();

router.post("/sign-up", MedicController.createMedic);
router.post("/login", MedicController.loginMedic);

module.exports = router;
