import React from 'react';
// Corregir la importación de DayList añadiendo la extensión .js
import DayList from './DayList.js';
// Corregir la importación del contexto añadiendo la extensión .js
import { useCalendar } from '../context/CalendarContext.js';

function WeekDetail() { 
  const { selectedWeek, people } = useCalendar(); 

  return (
    <div>
      {selectedWeek && <DayList people={people} />}
    </div>
  );
}

export default WeekDetail;
