import React from 'react';
import '../css/calendario.css';

import DaysCalendar from './DaysCalendar.js';
import WeekCount from './WeekCount.js';
// Corregir la importación del contexto añadiendo la extensión .js
import { useCalendar } from '../context/CalendarContext.js';

// El componente vuelve a aceptar la prop monthCalendario
function Calendarios({ monthCalendario }) {
  // Se obtiene el año y los festivos del contexto, pero se usa la prop para el mes
  const { yearSet, colombianHolidays } = useCalendar();

  const countDays = new Date(yearSet, monthCalendario + 1, 0).getDate();
  const days = Array.from({ length: countDays }, (_, index) => index + 1);
  const daysTitle = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  return (
    <div className="calendar">
      {/* Se pasa la prop monthCalendario a WeekCount */}
      <WeekCount
        monthCalendario={monthCalendario}
      />
      <ol className="ol">
        {daysTitle.map((dayL) => (
          <li className={`dayLetter`} key={dayL}>
            {dayL}
          </li>
        ))}

        {days.map((day) => (
          <DaysCalendar
            key={day}
            day={day}
            // Se pasa la prop monthCalendario a DaysCalendar
            monthCalendario={monthCalendario}
          />
        ))}
      </ol>
    </div>
  );
}

export default Calendarios;
