import React, { useMemo, useCallback, useState, useEffect } from 'react';
// Hook seguro para detectar móvil
function useIsMobile(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}
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
  // Fallback: no renderizar hasta que los datos clave estén listos
  if (!date || !shifts || !colombianHolidays) {
    return <div style={{padding: 24, textAlign: 'center'}}>Cargando calendario...</div>;
  }
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

  // Detectar si es móvil de forma segura
  const isMobile = useIsMobile(767);
  if (isMobile) {
      // Vista tipo lista para móvil
      const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      return (
        <div className="calendar-pro-wrapper">
          <ShiftLegend />
          <div className="calendar-pro-mobile">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateObj = new Date(year, month, day);
              const nombre = diasSemana[dateObj.getDay()];
              const holiday = isHoliday(day);
              const sunday = isSunday(day);
              return (
                <div
                  key={day}
                  className={
                    'calendar-mobile-day' +
                    (holiday ? ' holiday' : '') +
                    (sunday ? ' sunday' : '')
                  }
                >
                  <div className="calendar-mobile-day-header">
                    <span className="calendar-mobile-day-name">{nombre}</span>
                    <span className="calendar-mobile-day-number">{day}</span>
                  </div>
                  <div className="calendar-mobile-shifts">
                    {/* burbujas de turnos */}
                    {(() => {
                      const shiftsForDay = getShiftsForDay(day);
                      if (!shiftsForDay) return null;
                      const shiftItems = Object.entries(shiftsForDay).flatMap(([shift, people]) =>
                        people.map(person => ({ person, shift }))
                      );
                      return shiftItems.map(({ person, shift }) => (
                        <div
                          key={`${person.id}-${shift}`}
                          className="person-bubble"
                          title={`${person.name} (${formatShiftTitle(shift)})`}
                          style={{ backgroundColor: shiftColors[shift] }}
                        >
                          {createShortName(person.name, [])}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    // Desktop: grid tradicional
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
                isSunday={isSunday(day)}
              />
            );
          })}
        </div>
      </div>
    );
}

export default ProgrammingCalendar;
