export const getMondayNumbers = (month, year) => {
    const mondayNumbers = [];
    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay();
    let currentDay = 1;
  
    // Avanzar al siguiente lunes si el primer día no es lunes
    if (dayOfWeek !== 1) {
      const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      currentDay += daysUntilNextMonday;
    }
  
    // Obtener los números de los lunes en el mes
    while (currentDay <= new Date(year, month + 1, 0).getDate()) {
      mondayNumbers.push(currentDay);
      currentDay += 7;
    }
  
    return mondayNumbers;
  }
  