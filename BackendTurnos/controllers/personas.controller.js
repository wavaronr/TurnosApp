const Persona = require('../models/persona.model.js');

// Obtener todas las personas
exports.getPersonas = async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
