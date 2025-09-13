const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
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
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  // Otros campos que consideres necesarios
}, {
  timestamps: true // Agrega createdAt y updatedAt
});

const Persona = mongoose.model('Persona', personaSchema);

module.exports = Persona;
