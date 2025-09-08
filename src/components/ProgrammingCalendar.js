import React from 'react';
import { useCalendar } from '../context/CalendarContext.js';

function ProgrammingCalendar({ date }) {
  const { people, holidays, assignedDays } = useCalendar();
//console.log(holidays)
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isHoliday = (day) => {
    if (!holidays) return '';
    const holiday = holidays.find(h => h.day === day && h.month - 1 === month);
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
          if (!day) {
            return <div className="day-cell-pro empty" key={`empty-${index}`}></div>;
          }
          const peopleOnDay = getPeopleForDay(day);
          return (
            <div className={`day-cell-pro ${isHoliday(day)}`} key={day}>
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
