
// --- Servicio de Programación ---
// Este archivo centraliza todas las llamadas a la API relacionadas con la programación de turnos.

const API_URL = '/api/programming';

// --- Obtener la programación de un mes ---
// Llama a la API para descargar la programación completa de un año y mes específicos.
export const getProgramming = async (year, month) => {
  try {
    const response = await fetch(`${API_URL}/${year}/${month}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo obtener la programación.`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getProgramming:", error);
    throw error; // Propagar el error para que el componente que llama pueda manejarlo.
  }
};

// --- Guardar la programación de un mes ---
// Envía la programación actualizada al backend para que sea guardada.
export const saveProgramming = async (year, month, schedule) => {
  try {
    const response = await fetch(`${API_URL}/${year}/${month}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schedule }),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo guardar la programación.`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en saveProgramming:", error);
    throw error;
  }
};

// --- Obtener el estado de la programación (para revalidación) ---
// Llama al endpoint de 'status' para obtener solo la fecha de última modificación.
// Esta es una llamada ligera y eficiente para la estrategia stale-while-revalidate.
export const getProgrammingStatus = async (year, month) => {
  try {
    const response = await fetch(`${API_URL}/${year}/${month}/status`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo obtener el estado de la programación.`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getProgrammingStatus:", error);
    throw error;
  }
};
