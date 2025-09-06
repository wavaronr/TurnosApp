import React from 'react';
import '../css/calendario.css';

import DaysCalendar from './DaysCalendar.js';
import WeekCount from './WeekCount.js';
import { useCalendar } from '../context/CalendarContext'; // 1. Importar hook

// 2. Limpiar la firma del componente
function Calendarios({ monthCalendario }) {
  // 3. Obtener todo lo necesario del contexto
  const { yearSet, setSelectedWeek, setMonthCalendario, colombianHolidays } = useCalendar();

  const countDays = new Date(yearSet, monthCalendario + 1, 0).getDate();
  const days = Array.from({ length: countDays }, (_, index) => index + 1);
  const daysTitle = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  return (
    <div className="calendar">
      {/* 4. Pasar solo las props estrictamente necesarias a los hijos */}
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
          // DaysCalendar ahora obtendrá los datos del contexto también
          <DaysCalendar
            key={day}
            day={day}
            monthCalendario={monthCalendario}
          />
        ))}
      </ol>
    </div>
  );
}

export default Calendarios;
