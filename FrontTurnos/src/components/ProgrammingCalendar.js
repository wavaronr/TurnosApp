import React, { useMemo, useCallback } from 'react';
import { useCalendar } from '../context/CalendarContext.js';
import { shiftColors } from '../utils/shiftColors.js';
import { createShortName } from '../utils/textUtils.js'; // 1. Importar la función central
import '../css/ProgrammingCalendar.css';

// --- Helper Functions ---

const formatShiftTitle = (shift) => {
  const titles = { morning: 'Mañana', afternoon: 'Tarde', night: 'Noche', off: 'Libre' };
  return titles[shift] || shift;
};

// --- Components ---

const ShiftLegend = () => (
  <div className="shift-legend">
    {Object.entries(shiftColors).map(([shift, color]) => (
      <div key={shift} className="legend-item">
        <span className="legend-color" style={{ backgroundColor: color }}></span>
        {formatShiftTitle(shift)}
      </div>
    ))}
  </div>
);

const DayCell = React.memo(({ day, shiftsForDay, isHoliday, isSunday }) => { // 1. Recibir isSunday
  const shiftItems = useMemo(() => {
    if (!shiftsForDay) return [];
    return Object.entries(shiftsForDay).flatMap(([shift, people]) =>
      people.map(person => ({ person, shift }))
    );
  }, [shiftsForDay]);

  const shortNamesMap = useMemo(() => {
    const allPeopleInCell = shiftItems.map(item => item.person);
    return allPeopleInCell.reduce((acc, person) => {
      if (!acc[person.id]) {
        const existingShorts = Object.values(acc);
        acc[person.id] = createShortName(person.name, existingShorts);
      }
      return acc;
    }, {});
  }, [shiftItems]);

  return (
    // 2. Añadir la clase 'sunday' dinámicamente
    <div className={`day-cell-pro ${isHoliday ? 'holiday' : ''} ${isSunday ? 'sunday' : ''} ${shiftItems.length === 0 ? 'empty-day' : ''}`}>
      <div className="day-number-pro">{day}</div>
      <div className="people-list-pro">
        {shiftItems.map(({ person, shift }) => (
          <div
            key={`${person.id}-${shift}`}
            className="person-bubble"
            title={`${person.name} (${formatShiftTitle(shift)})`}
            style={{ backgroundColor: shiftColors[shift] }}
          >
            {shortNamesMap[person.id]}
          </div>
        ))}
      </div>
    </div>
  );
});


function ProgrammingCalendar({ date }) {
  const { shifts, colombianHolidays } = useCalendar();
  
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isHoliday = useCallback((day) => 
    colombianHolidays?.some(h => h.dia === day && h.mes === month + 1)
  , [colombianHolidays, month]);

  // 3. Función para determinar si es domingo
  const isSunday = useCallback((day) => {
    const date = new Date(year, month, day);
    return date.getDay() === 0; // 0 = Domingo
  }, [year, month]);

  const getShiftsForDay = useCallback((day) => 
    shifts?.[`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`] || null
  , [shifts, year, month]);

  const calendarGrid = useMemo(() => {
    const allCells = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    return allCells;
  }, [firstDayOfMonth, daysInMonth]);

  return (
    <div className="calendar-pro-wrapper">
      <ShiftLegend />
      <div className="calendar-pro">
        <div className="header-pro">Dom</div>
        <div className="header-pro">Lun</div>
        <div className="header-pro">Mar</div>
        <div className="header-pro">Mié</div>
        <div className="header-pro">Jue</div>
        <div className="header-pro">Vie</div>
        <div className="header-pro">Sáb</div>

        {calendarGrid.map((day, index) => {
          if (!day) return <div className="day-cell-pro empty" key={`empty-${index}`}></div>;
          
          return (
            <DayCell 
              key={day}
              day={day} 
              shiftsForDay={getShiftsForDay(day)} 
              isHoliday={isHoliday(day)}
              isSunday={isSunday(day)} // 4. Pasar la prop a DayCell
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProgrammingCalendar;
