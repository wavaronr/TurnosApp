/**
 * Comprueba si una fecha determinada es anterior al día de hoy.
 * Se utiliza para "bloquear" la edición de días pasados en la interfaz de usuario.
 * @param {Date} date - El objeto de fecha a comprobar.
 * @returns {boolean} - True si la fecha es pasada, false en caso contrario.
 */
export const isDateLocked = (date) => {
  const today = new Date();
  // Normalizar la fecha de hoy a las 00:00:00 para asegurar una comparación justa
  // solo a nivel de día, sin importar la hora.
  today.setHours(0, 0, 0, 0);
  
  // La fecha de entrada ya está en la zona horaria local y representa el día correcto.
  return date < today;
};