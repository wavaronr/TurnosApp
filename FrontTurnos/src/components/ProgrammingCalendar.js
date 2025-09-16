import React, { useMemo, useCallback } from 'react';
import { useCalendar } from '../context/CalendarContext.js';
import { shiftColors } from '../utils/shiftColors.js';
import '../css/ProgrammingCalendar.css';

// --- Helper Functions ---

const formatShiftTitle = (shift) => {
  const titles = { morning: 'Mañana', afternoon: 'Tarde', night: 'Noche', off: 'Libre' };
  return titles[shift] || shift;
};

// The new, more robust initials function, as you commanded.
const getInitials = (name) => {
  if (!name) return '';
  const names = name.trim().split(' ');
  const firstName = names[0] || '';

  // Case 1: Single word name (e.g., "Admin")
  if (names.length === 1) {
    return firstName.substring(0, 2).toUpperCase();
  }

  // Case 2: Multi-word name (e.g., "Juan Pérez")
  const lastName = names[names.length - 1] || '';
  const firstInitial = firstName[0] || '';
  const lastInitial = lastName[0] || '';

  // Add a middle initial from the *third* letter of the first name.
  // This resolves conflicts like "Juan" (JAP) vs "Julio" (JLP).
  let middleInitial = '';
  if (firstName.length > 2) {
    middleInitial = firstName[2];
  } 

  return (firstInitial + middleInitial + lastInitial).toUpperCase();
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

// DayCell is now a canvas for the bubbles.
const DayCell = React.memo(({ day, shiftsForDay, isHoliday }) => {
  const shiftItems = useMemo(() => {
    if (!shiftsForDay) return [];
    // Flatten the structure to a simple list of people and their shifts.
    return Object.entries(shiftsForDay).flatMap(([shift, people]) => 
      people.map(person => ({ person, shift }))
    );
  }, [shiftsForDay]);

  return (
    <div className={`day-cell-pro ${isHoliday ? 'holiday' : ''} ${shiftItems.length === 0 ? 'empty-day' : ''}`}>
      <div className="day-number-pro">{day}</div>
      {/* This list will now contain and wrap the bubbles. */}
      <div className="people-list-pro">
        {shiftItems.map(({ person, shift }) => (
          <div 
            key={`${person.id}-${shift}`}
            className="person-bubble"
            title={`${person.nombre} (${formatShiftTitle(shift)})`}
            // The bubble's color is its language.
            style={{ backgroundColor: shiftColors[shift] }}
          >
            {getInitials(person.nombre)}
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
