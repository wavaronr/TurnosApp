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
  // FIX: Incluir routeConfig en la desestructuración
  const { identificacion, nombre, apellido, email, cargo, telefono, routeConfig } = req.body;

  if (!nombre || !identificacion || !email || !apellido) {
    return res.status(400).json({ message: 'Los campos nombre, apellido, identificación y email son obligatorios.' });
  }

  try {
    const nuevaPersona = new Persona({
      identificacion,
      nombre,
      apellido,
      email,
      cargo,
      telefono,
      routeConfig, // FIX: Añadir routeConfig al objeto de creación
    });

    const personaGuardada = await nuevaPersona.save();
    res.status(201).json({ message: "Persona creada exitosamente", persona: personaGuardada });

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      const fieldName = field === 'identificacion' ? 'La identificación' : 'El email';
      return res.status(409).json({ message: `${fieldName} '${value}' ya está registrado.` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Error de validación: ${error.message}` });
    }
    console.error("Error al crear persona:", error);
    res.status(500).json({ message: 'Ocurrió un error inesperado en el servidor.' });
  }
};

// Actualizar una persona por ID
exports.updatePersona = async (req, res) => {
  try {
    const { id } = req.params;
    // FIX: Incluir routeConfig en la desestructuración
    const { nombre, apellido, email, telefono, cargo, routeConfig } = req.body;

    // FIX: Incluir routeConfig en el objeto de actualización
    const updatedPersona = await Persona.findByIdAndUpdate(
      id,
      { nombre, apellido, email, telefono, cargo, routeConfig },
      { new: true, runValidators: true }
    );

    if (!updatedPersona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.json(updatedPersona);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Error de validación: ${error.message}` });
    }
    console.error("Error al actualizar persona:", error);
    res.status(500).json({ message: 'Ocurrió un error inesperado en el servidor.' });
  }
};

// Eliminar una persona por ID
exports.deletePersona = async (req, res) => {
  try {
    const { id } = req.params;

    const personaEliminada = await Persona.findByIdAndDelete(id);

    if (!personaEliminada) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.json({ message: 'Persona eliminada exitosamente' });

  } catch (error) {
    console.error("Error al eliminar persona:", error);
    res.status(500).json({ message: 'Ocurrió un error inesperado en el servidor.' });
  }
};
