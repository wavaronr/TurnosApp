
const Programming = require('../models/programming.model.js');

// --- OBTENER PROGRAMACIÓN ---
// Busca la programación para un año y mes específicos. Si no existe, la crea vacía.
exports.getProgramming = async (req, res) => {
  try {
    const { year, month } = req.params;

    // Busca un documento de programación que coincida con el año y mes.
    let programming = await Programming.findOne({ year, month });

    // Si no se encuentra ninguna programación para ese mes, se crea una nueva y vacía.
    // Esto asegura que el frontend siempre reciba una estructura válida.
    if (!programming) {
      programming = new Programming({ year, month, schedule: {} });
      await programming.save();
    }

    // Se responde con los datos de la programación, que incluyen el schedule y lastModified.
    res.status(200).json(programming);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la programación', error: error.message });
  }
};

// --- GUARDAR PROGRAMACIÓN ---
// Guarda o actualiza la programación para un año y mes. Es el núcleo de la lógica de guardado.
exports.saveProgramming = async (req, res) => {
  try {
    const { year, month } = req.params;
    const { schedule } = req.body;
   // console.log('POST /api/programming:', { year, month, schedule });

    const updatedProgramming = await Programming.findOneAndUpdate(
      { year, month },
      { schedule },
      { new: true, upsert: true, runValidators: true }
    );

  //  console.log('Respuesta saveProgramming:', updatedProgramming);
    res.status(200).json(updatedProgramming);
  } catch (error) {
  //  console.error('Error en saveProgramming:', error);
    res.status(500).json({ message: 'Error al guardar la programación', error: error.message });
  }
};

// --- OBTENER ESTADO DE LA PROGRAMACIÓN (PARA REVALIDACIÓN) ---
// Endpoint ligero que solo devuelve la fecha de última modificación.
exports.getProgrammingStatus = async (req, res) => {
  try {
    const { year, month } = req.params;

    // Busca la programación correspondiente al año y mes.
    const programming = await Programming.findOne({ year, month });

    // Si no se encuentra, significa que no hay datos en el servidor.
    // Se devuelve `null` para que el cliente sepa que su caché (si la tiene) es inválida.
    if (!programming) {
      return res.status(200).json({ lastModified: null });
    }

    // Si se encuentra, se devuelve únicamente el campo `lastModified`.
    // Esto minimiza el uso de ancho de banda y permite al cliente decidir si necesita
    // descargar la programación completa.
    res.status(200).json({ lastModified: programming.lastModified });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el estado de la programación', error: error.message });
  }
};
