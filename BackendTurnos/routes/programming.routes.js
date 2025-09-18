
const express = require('express');
const router = express.Router();
const programmingController = require('../controllers/programming.controller.js');

// --- RUTAS PARA LA GESTIÓN DE LA PROGRAMACIÓN ---

// GET /api/programming/:year/:month
// Esta ruta se utiliza para obtener la programación completa de un mes específico.
// Llama a la función `getProgramming` del controlador.
router.get('/:year/:month', programmingController.getProgramming);

// POST /api/programming/:year/:month
// Esta ruta se utiliza para guardar o actualizar la programación de un mes específico.
// El cuerpo de la solicitud (body) debe contener el objeto `schedule`.
// Llama a la función `saveProgramming` del controlador.
router.post('/:year/:month', programmingController.saveProgramming);

// GET /api/programming/:year/:month/status
// Esta es la ruta para la estrategia de revalidación.
// Devuelve solo la fecha de última modificación (`lastModified`) para un mes específico,
// permitiendo al cliente verificar si su caché está actualizado sin descargar toda la data.
// Llama a la función `getProgrammingStatus` del controlador.
router.get('/:year/:month/status', programmingController.getProgrammingStatus);

module.exports = router;
