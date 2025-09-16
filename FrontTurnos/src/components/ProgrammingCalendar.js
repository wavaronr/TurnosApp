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

// La función local getInitials ha sido eliminada.

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

const DayCell = React.memo(({ day, shiftsForDay, isHoliday }) => {
  // Aplanamos los turnos para tener una lista simple de personas
  const shiftItems = useMemo(() => {
    if (!shiftsForDay) return [];
    return Object.entries(shiftsForDay).flatMap(([shift, people]) =>
      people.map(person => ({ person, shift }))
    );
  }, [shiftsForDay]);

  // 2. Generar un mapa de siglas para todas las personas en esta celda
  const shortNamesMap = useMemo(() => {
    const allPeopleInCell = shiftItems.map(item => item.person);
    return allPeopleInCell.reduce((acc, person) => {
      if (!acc[person.id]) { // Evita procesar la misma persona dos veces
        const existingShorts = Object.values(acc);
        // Usamos la función centralizada y pasamos las siglas existentes en esta celda
        acc[person.id] = createShortName(person.name, existingShorts);
      }
      return acc;
    }, {});
  }, [shiftItems]);

  return (
    <div className={`day-cell-pro ${isHoliday ? 'holiday' : ''} ${shiftItems.length === 0 ? 'empty-day' : ''}`}>
      <div className="day-number-pro">{day}</div>
      <div className="people-list-pro">
        {shiftItems.map(({ person, shift }) => (
          <div
            key={`${person.id}-${shift}`}
            className="person-bubble"
            title={`${person.name} (${formatShiftTitle(shift)})`} // Se usa person.name
            style={{ backgroundColor: shiftColors[shift] }}
          >
            {/* 3. Usar el mapa para mostrar la sigla correcta */}
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
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProgrammingCalendar;
