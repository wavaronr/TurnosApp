/**
 * Acorta un nombre a una sigla de 3 letras o más si hay colisiones.
 * @param {string} name - El nombre completo de la persona.
 * @param {Array<string>} existingShorts - Un array de siglas ya existentes para evitar colisiones.
 * @returns {string} - La sigla generada.
 */
export const createShortName = (name, existingShorts) => {
  if (!name) {
    return '';
  }

  // 1. Tomar las primeras 3 letras y convertir a mayúsculas.
  let shortName = name.substring(0, 3).toUpperCase();

  // 2. Si la sigla ya existe, buscar una nueva añadiendo un número.
  if (existingShorts.includes(shortName)) {
    let count = 2;
    let newShortName = `${shortName}${count}`;
    while (existingShorts.includes(newShortName)) {
      count++;
      newShortName = `${shortName}${count}`;
    }
    shortName = newShortName;
  }

  return shortName;
};

export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
