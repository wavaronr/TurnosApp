const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  // Nuevo campo para la cédula, requerido y único
  identificacion: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // El teléfono ya no es obligatorio
  telefono: {
    type: String,
    required: false,
    trim: true
  },
  // El cargo tampoco es obligatorio
  cargo: {
    type: String,
    required: false,
    trim: true
  },
}, {
  timestamps: true
});

const Persona = mongoose.model('Persona', personaSchema);

module.exports = Persona;