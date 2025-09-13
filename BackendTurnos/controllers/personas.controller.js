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

// Obtener una persona por ID
exports.getPersonaById = async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);
    if (persona) {
      res.json(persona);
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una persona
exports.updatePersona = async (req, res) => {
  try {
    const persona = await Persona.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (persona) {
      res.json(persona);
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una persona
exports.deletePersona = async (req, res) => {
  try {
    const persona = await Persona.findByIdAndDelete(req.params.id);
    if (persona) {
      res.json({ message: 'Persona eliminada correctamente' });
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
