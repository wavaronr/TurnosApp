import React from 'react';
import DayCard from './DayCard.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import { useCalendar } from '../context/CalendarContext.js';

function DayList({ people }) {
  const { selectedWeek, yearSet } = useCalendar();

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
            weekDays={weekDays} // Propagamos la semana completa a cada tarjeta de día
          />
        ))}
      </ol>
    </div>
  );
}

export default DayList;