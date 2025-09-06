import React from 'react';
import DayCard from './DayCard.js';
// Corregir la ruta de importación de getWeekDays
import { getWeekDays } from '../utils/getWeekDays.js';
import { useCalendar } from '../context/CalendarContext.js';

function DayList({ people }) {
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
