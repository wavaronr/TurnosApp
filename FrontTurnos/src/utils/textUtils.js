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

/**
 * Capitaliza la primera letra de cada palabra en un texto.
 * Ejemplo: "wilmer alexander" se convierte en "Wilmer Alexander".
 * @param {string} text - El texto a capitalizar.
 * @returns {string} - El texto con cada palabra capitalizada.
 */
export const capitalize = (text) => {
  if (!text) return '';
  // Divide el texto por espacios, capitaliza la primera letra de cada palabra
  // y luego las une de nuevo con un espacio.
  const arrayText =text.split(' ')
  return arrayText.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};
