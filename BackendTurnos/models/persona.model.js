const mongoose = require('mongoose');

// Sub-esquema para la configuración de cada turno (mañana, tarde, noche)
const routeShiftConfigSchema = new mongoose.Schema({
  required: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['all', 'specific'],
    default: 'all'
  },
  days: [{
    type: String
  }]
}, { _id: false }); // _id: false para que no cree un ID para cada sub-objeto

const personaSchema = new mongoose.Schema({
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
  telefono: {
    type: String,
    required: false,
    trim: true
  },
  cargo: {
    type: String,
    required: false,
    trim: true
  },
  // FIX: Definir el esquema CORRECTO para la configuración de rutas
  routeConfig: {
    morning: routeShiftConfigSchema,
    afternoon: routeShiftConfigSchema,
    night: routeShiftConfigSchema
  },
}, {
  timestamps: true
});

const Persona = mongoose.model('Persona', personaSchema);

module.exports = Persona;