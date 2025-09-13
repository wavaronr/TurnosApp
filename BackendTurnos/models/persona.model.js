
const mongoose = require('mongoose');

// Un esquema define la estructura de los documentos dentro de una colección.
const personaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] // Validación: el campo no puede estar vacío.
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    identificacion: {
        type: String,
        required: [true, 'La identificación es obligatoria'],
        unique: true // Asegura que no haya dos personas con la misma identificación.
    },
    cargo: {
        type: String,
        required: [true, 'El cargo es obligatorio']
    },
    // 'perfil' es más descriptivo que 'rol' para tus necesidades.
    perfil: {
        type: String,
        required: [true, 'El perfil es obligatorio']
    },
    estado: {
        type: String,
        required: true,
        enum: ['Activo', 'Inactivo'], // Solo permite estos dos valores.
        default: 'Activo' // Si no se especifica, automáticamente será 'Activo'.
    }
}, {
    // Opciones del esquema:
    timestamps: true, // Añade automáticamente los campos `createdAt` y `updatedAt`.
    versionKey: false // Evita que se añada el campo `__v` a los documentos.
});

// Se crea el modelo a partir del esquema.
// Mongoose tomará el nombre 'Persona', lo pondrá en minúsculas y en plural -> 'personas'
// y esa será la colección en la base de datos MongoDB.
const Persona = mongoose.model('Persona', personaSchema);

// Exportamos el modelo para poder usarlo en otras partes de la aplicación (como en los controladores y rutas).
module.exports = Persona;
