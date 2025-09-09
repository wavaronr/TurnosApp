import React, { useState, useCallback } from 'react';
import { useCalendar } from '../context/CalendarContext.js';
import { shiftColors } from '../utils/shiftColors.js';
import Popover from './Popover';
import '../css/ProgrammingCalendar.css';

const formatShiftTitle = (shift) => {
  if (shift === 'morning') return 'Mañana';
  if (shift === 'afternoon') return 'Tarde';
  if (shift === 'night') return 'Noche';
  if (shift === 'off') return 'Libre';
  return shift;
};

const getAbbreviations = (people) => {
  const abbreviations = new Map();
  const usedCodes = new Set();

  people.forEach(person => {
    const parts = person.name.trim().toUpperCase().split(' ').filter(p => p);
    let code = '';

    if (parts.length >= 2) {
      code = parts[0].substring(0, 2) + parts[1].substring(0, 2);
    } else if (parts.length === 1) {
      code = parts[0].substring(0, 4);
    }

    if (usedCodes.has(code)) {
      if (parts.length >= 2 && parts[0].length >= 3) {
        const alternativeCode = parts[0][0] + parts[0][2] + parts[1].substring(0, 2);
        if (!usedCodes.has(alternativeCode)) {
          code = alternativeCode;
        } else {
          let i = 2;
          while (usedCodes.has(code.substring(0, 3) + i)) {
            i++;
          }
          code = code.substring(0, 3) + i;
        }
      }
    }
    
    abbreviations.set(person.id, code);
    usedCodes.add(code);
  });

  return abbreviations;
};

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

function ProgrammingCalendar({ date }) {
  const { shifts, colombianHolidays } = useCalendar();
  const [popover, setPopover] = useState({ visible: false, content: null, position: { x: 0, y: 0 } });

  const handleMouseLeave = useCallback(() => {
    setPopover(p => ({ ...p, visible: false }));
  }, []);

  const year = date.getFullYear();
  const month = date.getMonth();

  if (year !== 2025 || month !== 8) {
    return <div className="calendar-pro-wrapper"><p>No hay datos de programación para este mes.</p></div>;
  }

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isHoliday = (day) => colombianHolidays?.find(h => h.dia === day && h.mes === month + 1) ? 'holiday' : '';
  const getShiftsForDay = (day) => shifts?.[`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`] || null;

  const allCells = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (allCells.length % 7 !== 0) allCells.push(null);

  return (
    <div className="calendar-pro-wrapper">
      {/* Pass the visible prop to the Popover component */}
      {popover.visible && (
        <Popover position={popover.position} visible={popover.visible}>
          {popover.content}
        </Popover>
      )}
      <ShiftLegend />
      <div className="calendar-pro" onMouseLeave={handleMouseLeave}>
        <div className="header-pro">Dom</div>
        <div className="header-pro">Lun</div>
        <div className="header-pro">Mar</div>
        <div className="header-pro">Mie</div>
        <div className="header-pro">Jue</div>
        <div className="header-pro">Vie</div>
        <div className="header-pro">Sab</div>

        {allCells.map((day, index) => {
          if (!day) return <div className="day-cell-pro empty" key={`empty-${index}`}></div>;
          
          const dayShifts = getShiftsForDay(day);
          const allPeople = dayShifts ? Object.values(dayShifts).flat() : [];
          const abbreviations = getAbbreviations(allPeople);
          const shiftItems = dayShifts ? Object.entries(dayShifts).flatMap(([shift, people]) => people.map(person => ({ person, shift }))) : [];

          const displayLimit = 9;
          const visibleItems = shiftItems.slice(0, displayLimit);
          const hiddenItems = shiftItems.slice(displayLimit);

          const handleMouseEnter = (e, items) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const content = (
              <>
                {items.map(({ person, shift }) => (
                  <div key={person.id} className="popover-item">
                    <span className="shift-dot" style={{ backgroundColor: shiftColors[shift] }}></span>
                    {person.name}
                  </div>
                ))}
              </>
            );
            setPopover({
              visible: true,
              content,
              position: {
                x: rect.left + rect.width / 2, 
                y: rect.top
              },
            });
          };

          return (
            <div className={`day-cell-pro ${isHoliday(day)}`} key={day}>
              <div className="day-number-pro">{day}</div>
              <div className="people-list-pro">
                {visibleItems.map(({ person, shift }) => (
                  <div key={`${person.id}-${shift}`} className="person-item" title={person.name}>
                    <span className="shift-dot" style={{ backgroundColor: shiftColors[shift] }}></span>
                    {abbreviations.get(person.id)}
                  </div>
                ))}
                {hiddenItems.length > 0 && (
                  <div 
                    className="more-indicator"
                    onMouseEnter={(e) => handleMouseEnter(e, hiddenItems)}
                  >
                    +{hiddenItems.length}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgrammingCalendar;
