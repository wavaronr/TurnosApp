const express = require('express');
const router = express.Router();
const personasController = require('../controllers/personas.controller.js');

// Obtener todas las personas
router.get('/', personasController.getPersonas);

// Crear una nueva persona
router.post('/', personasController.createPersona);

// Actualizar una persona por ID
router.put('/:id', personasController.updatePersona);

// Eliminar una persona por ID
router.delete('/:id', personasController.deletePersona);

module.exports = router;