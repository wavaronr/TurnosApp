require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Persona = require('../models/persona.model.js'); // Ajusta la ruta si es diferente

const MONGODB_URI = process.env.MONGODB_URI;
const DEFAULT_PASSWORD = 'usuario1';
const DEFAULT_ROLE = 'OPR';

async function actualizarPersonas() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB');

    const personas = await Persona.find();

    for (const persona of personas) {
      let actualizado = false;

      if (!persona.role) {
        persona.role = DEFAULT_ROLE;
        actualizado = true;
      }

      if (!persona.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
        persona.password = hashedPassword;
        actualizado = true;
      }

      if (actualizado) {
        await persona.save();
        console.log(`📝 Persona actualizada: ${persona.email}`);
      }
    }

    console.log('✅ Todas las personas han sido actualizadas correctamente.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error al actualizar personas:', err);
  }
}

actualizarPersonas();
// Ejecutar con: npm run actualizar-usuarios