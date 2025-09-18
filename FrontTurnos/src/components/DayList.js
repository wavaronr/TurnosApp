import React from 'react';
import DayCard from './DayCard.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import { useCalendar } from '../context/CalendarContext.js';

// CORRECCIÓN: Usar exportación nombrada
export const DayList = () => {
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
            weekDays={weekDays}
          />
        ))}
      </ol>
    </div>
  );
}
