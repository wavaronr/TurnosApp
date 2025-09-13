const express = require('express');
const router = express.Router();
const personasController = require('../controllers/personas.controller.js');

// Obtener todas las personas
router.get('/', personasController.getPersonas);

// Crear una nueva persona
router.post('/', personasController.createPersona);

module.exports = router;
