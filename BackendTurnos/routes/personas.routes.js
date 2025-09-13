const express = require('express');
const router = express.Router();
const personasController = require('../controllers/personas.controller.js');

// Obtener todas las personas
router.get('/', personasController.getPersonas);

module.exports = router;
