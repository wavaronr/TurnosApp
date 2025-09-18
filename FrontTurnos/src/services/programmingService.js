// Este servicio encapsula las llamadas a la API para la gestión de la programación.

/**
 * Obtiene la programación guardada para un año y mes específicos.
 * @param {number} year - El año a consultar.
 * @param {number} month - El mes a consultar (1-12).
 * @returns {Promise<Object|null>} El objeto de la programación o null si no se encuentra.
 */
export const getProgramming = async (year, month) => {
  try {
    const response = await fetch(`/api/programming/${year}/${month}`);
    if (response.status === 404) {
      return null; // Es un caso esperado, no un error.
    }
    if (!response.ok) {
      throw new Error('Error en la respuesta de la red al obtener la programación.');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener la programación:', error);
    throw error; // Relanzar para que el contexto pueda manejarlo.
  }
};

/**
 * Crea o actualiza la programación para un año y mes específicos.
 * @param {number} year - El año a guardar.
 * @param {number} month - El mes a guardar (1-12).
 * @param {Object} schedule - El objeto de la programación a guardar.
 * @returns {Promise<Object>} La programación guardada.
 */
export const saveProgramming = async (year, month, schedule) => {
  try {
    const response = await fetch(`/api/programming/${year}/${month}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schedule }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al guardar la programación.');
    }
    return response.json();
  } catch (error) {
    console.error('Error al guardar la programación:', error);
    throw error; // Relanzar para que el contexto pueda manejarlo.
  }
};

/**
 * Obtiene solo la fecha de última modificación de una programación.
 * @param {number} year - El año a consultar.
 * @param {number} month - El mes a consultar (1-12).
 * @returns {Promise<{lastModified: string | null}>} Un objeto con la fecha o null.
 */
export const getProgrammingStatus = async (year, month) => {
  try {
    const response = await fetch(`/api/programming/${year}/${month}/status`);
    if (!response.ok) {
      throw new Error('Error en la respuesta de la red al obtener el estado.');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener el estado de la programación:', error);
    throw error;
  }
};