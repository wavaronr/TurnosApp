import React from 'react';
import '../css/calendario.css';

import Calendarios from './Calendarios.js';
import YearInput from './yearinput';
import { getMonthsTitule } from '../utils/getMonthsTitule.js';
import { useCalendar } from '../context/CalendarContext'; // 1. Importar el hook

// 2. La firma del componente está limpia, sin props del calendario
function CardsCald() { 
  // 3. Obtener solo la función necesaria del contexto
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
              {/* 4. Ya no se pasan props a Calendarios */}
              <Calendarios monthCalendario={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardsCald;
