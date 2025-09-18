const express = require('express');
const router = express.Router();
const programmingController = require('../controllers/programming.controller.js');

// Esta ruta debe ir primero para que no sea capturada por /:year/:month
router.get('/:year/:month/status', programmingController.getProgrammingStatus);

router.get('/:year/:month', programmingController.getProgramming);
router.put('/:year/:month', programmingController.updateProgramming);

module.exports = router;