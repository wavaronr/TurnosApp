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

// Crear una nueva persona
exports.createPersona = async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;

  try {
    const nuevaPersona = new Persona({
      nombre,
      apellido,
      email,
      telefono,
    });

    const personaGuardada = await nuevaPersona.save();
    res.status(201).json(personaGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
