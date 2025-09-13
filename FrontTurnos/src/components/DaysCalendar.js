import React from "react";
import "../css/calendario.css";
// Corregir la importación del contexto añadiendo la extensión .js
import { useCalendar } from '../context/CalendarContext.js';

// El componente vuelve a aceptar la prop monthCalendario
function DaysCalendar({ day, monthCalendario }) {
  // Se obtiene el año y los festivos del contexto, pero se usa la prop para el mes
  const { colombianHolidays, yearSet } = useCalendar();

  const isFirstDay = day === 1;
  const isHoliday = colombianHolidays.some(
    (festivo) => festivo.dia === day && festivo.mes === monthCalendario + 1
  );

  const firstDayOfMonth = new Date(yearSet, monthCalendario, 1).getDay();

  const dayStart = firstDayOfMonth;

  const listItemStyle = {
    ...(isHoliday && { color: "red", fontWeight: "bold" }),
    ...(isFirstDay && { gridColumnStart: dayStart +1 }),
  };

  return (
    <li
      key={day}
      className={isFirstDay ? "firstday" : "weekdays"}
      style={listItemStyle}
    >
      {day}
    </li>
  );
}

export default DaysCalendar;
