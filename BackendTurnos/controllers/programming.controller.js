const Programming = require('../models/programming.model.js');

exports.getProgramming = async (req, res) => {
  try {
    const { year, month } = req.params;
    const programming = await Programming.findOne({ year: parseInt(year), month: parseInt(month) });
    if (!programming) {
      return res.status(404).json({ message: 'No se encontró programación para esta fecha.' });
    }
    res.status(200).json(programming);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la programación.', error: error.message });
  }
};

// Nueva función para obtener solo la fecha de modificación
exports.getProgrammingStatus = async (req, res) => {
  try {
    const { year, month } = req.params;
    const programming = await Programming.findOne(
      { year: parseInt(year), month: parseInt(month) },
      'lastModified' // Selecciona únicamente el campo lastModified
    );

    if (!programming) {
      // Si no existe, devolvemos null, es un caso esperado.
      return res.status(200).json({ lastModified: null });
    }

    res.status(200).json({ lastModified: programming.lastModified });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el estado de la programación.', error: error.message });
  }
};

exports.updateProgramming = async (req, res) => {
  const { year, month } = req.params;
  const { schedule } = req.body;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const requestedYear = parseInt(year);
  const requestedMonth = parseInt(month);

  if (requestedYear < currentYear || (requestedYear === currentYear && requestedMonth < currentMonth)) {
    return res.status(403).json({ message: 'No se puede modificar la programación de meses pasados.' });
  }

  try {
    // Forzar la actualización de lastModified en cada PUT
    const updatedProgramming = await Programming.findOneAndUpdate(
      { year: requestedYear, month: requestedMonth },
      { schedule: schedule, $set: { lastModified: new Date() } }, // Usar $set para asegurar la actualización
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(updatedProgramming);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la programación.', error: error.message });
  }
};