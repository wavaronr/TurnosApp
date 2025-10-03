import React from 'react';
import '../css/calendario.css';

import Calendarios from '../components/Calendarios.js';
// Corregir la importación de YearInput añadiendo la extensión .js
import YearInput from '../components/yearinput.js';
import { getMonthsTitule } from '../utils/getMonthsTitule.js';
// Corregir la importación del contexto añadiendo la extensión .js
import { useCalendar } from '../context/CalendarContext.js';


import { useEffect, useRef } from 'react';

function isMobile() {
  return window.innerWidth <= 768;
}

function CardsCald() {
  const { setYearSet } = useCalendar();
  const months = getMonthsTitule();
  const currentMonth = new Date().getMonth();
  const monthRefs = useRef([]);

  const handleYearChange = (newYear) => {
    setYearSet(newYear);
  };

  useEffect(() => {
    if (isMobile() && monthRefs.current[currentMonth]) {
      monthRefs.current[currentMonth].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="calendar-container">
      <div className="year-selector">
        <YearInput onYearChange={handleYearChange} />
      </div>
      <div className="calendar-grid" style={{ maxHeight: isMobile() ? '80vh' : 'auto', overflowY: isMobile() ? 'auto' : 'visible' }}>
        {months.map((mes, index) => (
          <div
            className="month-card"
            key={mes}
            ref={el => monthRefs.current[index] = el}
          >
            <div className="month-header">
              <h5 className="month-title">{mes}</h5>
            </div>
            <div className="calendar-wrapper">
              <Calendarios monthCalendario={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardsCald;
