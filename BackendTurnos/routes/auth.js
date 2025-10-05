const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Persona = require('../models/persona.model.js'); // Asegúrate de que la ruta sea correcta

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const persona = await Persona.findOne({ email });
    if (!persona) return res.status(401).json({ error: 'Usuario no encontrado' });

    const valid = await persona.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Generar token
    const token = jwt.sign(
      { id: persona._id, role: persona.role },
      process.env.JWT_SECRET, // 👈 Usa variable de entorno
      { expiresIn: '1d' }
    );

    res.json({ token, persona: { email: persona.email, role: persona.role } });
    //console.log({ token, persona: { email: persona.email, role: persona.role } });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;