import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext.js';
import { shiftColors } from '../utils/shiftColors.js';
import Popover from './Popover';
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

const DayCell = React.memo(({ day, shiftsForDay, isHoliday, onShowMore }) => {
  const displayLimit = 4;

  const shiftItems = useMemo(() => {
    if (!shiftsForDay) return [];
    return Object.entries(shiftsForDay).flatMap(([shift, people]) => 
      people.map(person => ({ person, shift }))
    );
  }, [shiftsForDay]);

  const visibleItems = shiftItems.slice(0, displayLimit);
  const hiddenItems = shiftItems.slice(displayLimit);

  const handleShowMore = (e) => {
    if (hiddenItems.length > 0) {
      onShowMore(e, hiddenItems);
    }
  };

  return (
    <div className={`day-cell-pro ${isHoliday ? 'holiday' : ''}`}>
      <div className="day-number-pro">{day}</div>
      <div className="people-list-pro">
        {visibleItems.map(({ person, shift }) => (
          <div key={`${person.id}-${shift}`} className="person-item" title={person.name}>
            <span className="shift-dot" style={{ backgroundColor: shiftColors[shift] }}></span>
            {person.name}
          </div>
        ))}
        {hiddenItems.length > 0 && (
          <div className="more-indicator" onClick={handleShowMore}>
            +{hiddenItems.length} más
          </div>
        )}
      </div>
    </div>
  );
});

function ProgrammingCalendar({ date }) {
  const { shifts, colombianHolidays } = useCalendar();
  const [popover, setPopover] = useState({ visible: false, content: null, position: { x: 0, y: 0 } });

  const year = date.getFullYear();
  const month = date.getMonth();

  // --- Click-away logic for the Popover ---
  useEffect(() => {
    if (!popover.visible) return;

    const handleClickOutside = (event) => {
      // If click is not inside the popover content, close it
      if (!event.target.closest('.popover-content') && !event.target.closest('.more-indicator')) {
        setPopover(p => ({ ...p, visible: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popover.visible]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isHoliday = useCallback((day) => 
    colombianHolidays?.some(h => h.dia === day && h.mes === month + 1)
  , [colombianHolidays, month]);

  const getShiftsForDay = useCallback((day) => 
    shifts?.[`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`] || null
  , [shifts, year, month]);

  const showMorePopover = useCallback((e, items) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();

    // --- The DIVINE, ENHANCED Popover Content ---
    const content = (
      <>
        {items.map(({ person, shift }) => (
          <div key={`${person.id}-${shift}`} className="popover-item">
            <span className="shift-dot" style={{ backgroundColor: shiftColors[shift] }}></span>
            <span>
              {person.name} <span style={{ color: '#555', fontSize: '0.85em' }}>({formatShiftTitle(shift)})</span>
            </span>
          </div>
        ))}
      </>
    );

    setPopover({
      visible: true,
      content,
      // Position it beautifully above the indicator
      position: { x: rect.left + rect.width / 2, y: rect.top },
    });
  }, []);

  const calendarGrid = useMemo(() => {
    const allCells = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    while (allCells.length % 7 !== 0) allCells.push(null);
    return allCells;
  }, [firstDayOfMonth, daysInMonth]);

  return (
    <div className="calendar-pro-wrapper">
      {popover.visible && (
        <Popover position={popover.position} visible={popover.visible}>
          {popover.content}
        </Popover>
      )}
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
              onShowMore={showMorePopover}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProgrammingCalendar;
