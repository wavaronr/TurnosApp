import React from 'react';
import DayCard from './DayCard.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import { useCalendar } from '../context/CalendarContext.js';

function DayList() { // Remove people from props
  const { selectedWeek, yearSet, people } = useCalendar(); // Get people from context

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
            // No longer pass people as a prop
            weekDays={weekDays}
          />
        ))}
      </ol>
    </div>
  );
}

export default DayList;