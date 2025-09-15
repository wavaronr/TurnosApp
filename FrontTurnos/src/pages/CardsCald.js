import React from 'react';
import '../css/calendario.css';

import Calendarios from '../components/Calendarios.js';
// Corregir la importación de YearInput añadiendo la extensión .js
import YearInput from '../components/yearinput.js';
import { getMonthsTitule } from '../utils/getMonthsTitule.js';
// Corregir la importación del contexto añadiendo la extensión .js
import { useCalendar } from '../context/CalendarContext.js';

function CardsCald() { 
  const { setYearSet } = useCalendar();
  const months = getMonthsTitule();

  const handleYearChange = (newYear) => {
    setYearSet(newYear);
  };

  return (
    <div className="calendar-container">
      <div className="year-selector">
        <YearInput onYearChange={handleYearChange} />
      </div>
      <div className="calendar-grid">
        {months.map((mes, index) => (
          <div className="month-card" key={mes}>
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
