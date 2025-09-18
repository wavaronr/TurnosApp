
const mongoose = require('mongoose');

// Este es el esquema para almacenar la programación de un mes específico.
const ProgrammingSchema = new mongoose.Schema({
  // Año de la programación
  year: {
    type: Number,
    required: true,
    index: true, // Optimiza las búsquedas por año
  },
  // Mes de la programación (1 = Enero, 12 = Diciembre)
  month: {
    type: Number,
    required: true,
    index: true, // Optimiza las búsquedas por mes
  },
  // El `schedule` almacena la programación del mes.
  // Es un objeto (Map) donde cada clave es una fecha en formato "YYYY-MM-DD".
  // El valor es otro objeto que contiene los turnos (morning, afternoon, night, off),
  // y cada turno es un array de IDs de personas.
  schedule: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Permite una estructura flexible dentro del mapa
    default: {},
  },
  // `lastModified` es una fecha que se actualiza automáticamente cada vez que se
  // guarda o modifica el documento. Esto es crucial para la estrategia de revalidación,
  // ya que nos permite saber si el cliente tiene la última versión.
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

// Se crea un índice compuesto por año y mes para garantizar que no haya
// dos documentos para el mismo mes del mismo año y para acelerar las búsquedas.
ProgrammingSchema.index({ year: 1, month: 1 }, { unique: true });

// Middleware de Mongoose: antes de cada operación `save`, actualizamos el campo `lastModified`.
// Esto asegura que `lastModified` siempre refleje la fecha de la última actualización.
ProgrammingSchema.pre('save', function (next) {
  this.lastModified = new Date();
  next();
});

const Programming = mongoose.model('Programming', ProgrammingSchema);

module.exports = Programming;
