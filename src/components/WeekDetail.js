import React from 'react';
import DayList from './DayList';
import { useCalendar } from '../context/CalendarContext'; // Importar hook

// Limpiar firma, solo necesita people
function WeekDetail({ people }) { 
  const { selectedWeek } = useCalendar(); // Obtener datos del contexto

  return (
    <div>
      {/* DayList tomará los datos del contexto */}
      {selectedWeek && <DayList people={people} />}
    </div>
  );
}

export default WeekDetail;
