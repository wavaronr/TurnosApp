import React from "react";
import "../css/calendario.css";

function DaysCalendar({ day, colombianHolidays, monthCalendario, yearSet }) {
  const isFirstDay = day === 1;
  const isHoliday = colombianHolidays.some(
    (festivo) => festivo.dia === day && festivo.mes === monthCalendario
  );

  // Obtiene el primer día de la semana (0 para Domingo, 1 para Lunes, etc.)
  const firstDayOfMonth = new Date(yearSet, monthCalendario, 1).getDay();

  // Ajusta el valor para que Domingo sea 1, Lunes 2, etc.
  const dayStart = firstDayOfMonth + 1;

  const listItemStyle = {
    ...(isHoliday && { color: "red", fontWeight: "bold" }),
    ...(isFirstDay && { gridColumnStart: dayStart }),
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
