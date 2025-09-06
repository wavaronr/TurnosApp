import React from 'react';
import DayCard from './DayCard.js';
import { getWeekDays } from './getWeekDays.js';
import { useCalendar } from '../context/CalendarContext'; // Importar hook

// Limpiar firma, solo necesita people
function DayList({ people }) {
  // Obtener datos del contexto
  const { selectedWeek, yearSet, colombianHolidays } = useCalendar();

  if (!selectedWeek) {
    return null;
  }
  const weekDays = getWeekDays(selectedWeek, yearSet);

  return (
    <div>
      <h5>Días de la Semana:</h5>
      <ol>
        {weekDays.map((day) => (
          // DayCard también debe ser refactorizado
          <DayCard 
            key={day.toISOString()} 
            day={day} 
            people={people}
          />
        ))}
      </ol>
    </div>
  );
}

export default DayList;
