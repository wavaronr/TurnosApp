import React from "react";
import "../css/calendario.css";
import { useCalendar } from '../context/CalendarContext'; // Importar hook

// Limpiar la firma
function DaysCalendar({ day, monthCalendario }) {
  // Obtener datos del contexto
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
