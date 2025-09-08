import React from 'react';
import { useCalendar } from '../context/CalendarContext.js';

function ProgrammingCalendar({ date }) {
  const { people, colombianHolidays, assignedDays } = useCalendar();
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isHoliday = (day) => {
    if (!colombianHolidays) return '';
    // Lógica de comparación corregida para el mes (festivo.mes es 1-12, month es 0-11)
    const holiday = colombianHolidays.find(h => h.dia === day && h.mes === month + 1);
    return holiday ? 'holiday' : '';
  };
  

  const getPeopleForDay = (day) => {
    if (!assignedDays || !people) {
      return [];
    }
    const key = `${year}-${month + 1}-${day}`;
    const dayAssignments = assignedDays[key] || {};
    return Object.keys(dayAssignments).map(personId => {
      const person = people.find(p => p.id.toString() === personId);
      return person ? person.name : null;
    }).filter(name => name !== null);
  };

  const allCells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  while (allCells.length % 7 !== 0) {
    allCells.push(null);
  }

  return (
    <div className="calendar-pro-wrapper">
      <div className="calendar-pro">
        <div className="header-pro">Dom</div>
        <div className="header-pro">Lun</div>
        <div className="header-pro">Mar</div>
        <div className="header-pro">Mie</div>
        <div className="header-pro">Jue</div>
        <div className="header-pro">Vie</div>
        <div className="header-pro">Sab</div>

        {allCells.map((day, index) => {
          console.log(isHoliday(day))
          if (!day) {
            return <div className="day-cell-pro empty" key={`empty-${index}`}></div>;
          }
          const peopleOnDay = getPeopleForDay(day);
          return (
            <div className={`day-cell-pro ${isHoliday(day)}` } key={day} >
              <div className="day-number-pro">{day}</div>
              <div className="people-list-pro">
                {peopleOnDay.map((name, i) => <div key={i}>{name}</div>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgrammingCalendar;
