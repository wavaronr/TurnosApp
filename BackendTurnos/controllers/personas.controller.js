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
  // El formulario del frontend envía: { name, id, email, cargo, telefono }
  // El backend y el modelo esperan: { nombre, apellido, identificacion, email, cargo, telefono }
  const { name, id, email, cargo, telefono } = req.body;

  // Lógica para dividir el 'name' en 'nombre' y 'apellido'
  const nameParts = (name || '').trim().split(' ');
  const nombre = nameParts.shift() || ''; // El primer elemento es el nombre
  const apellido = nameParts.join(' ') || ''; // El resto es el apellido

  // Verificación para asegurar que los campos requeridos están presentes
  if (!nombre || !id || !email) {
    return res.status(400).json({ message: 'Los campos nombre, identificación (id) y email son obligatorios.' });
  }

  try {
    const nuevaPersona = new Persona({
      identificacion: id,
      nombre,
      apellido,
      email,
      cargo, // Opcional
      telefono, // Opcional
    });

    const personaGuardada = await nuevaPersona.save();
    
    // Devolvemos un objeto que coincide con lo que el frontend espera
    res.status(201).json({ message: "Persona creada exitosamente", persona: personaGuardada });

  } catch (error) {
    // Error de duplicado (cédula o email ya existen)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      const fieldName = field === 'identificacion' ? 'La identificación' : 'El email';
      return res.status(409).json({ message: `${fieldName} '${value}' ya está registrado.` });
    }

    // Error de validación del modelo
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Error de validación: ${error.message}` });
    }
    
    // Otros errores
    console.error("Error al crear persona:", error);
    res.status(500).json({ message: 'Ocurrió un error inesperado en el servidor.' });
  }
};
