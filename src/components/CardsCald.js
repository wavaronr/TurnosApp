import React from 'react';
import '../css/calendario.css';

import Calendarios from './Calendarios.js';
import YearInput from './yearinput';
import { getMonthsTitule } from '../utils/getMonthsTitule.js';

function CardsCald({ setSelectedWeek, yearSet, setYearSet, setMonthCalendario, colombianHolidays }) {
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
              <Calendarios
                monthCalendario={index}
                yearSet={yearSet}
                setSelectedWeek={setSelectedWeek}
                setMonthCalendario={setMonthCalendario}
                colombianHolidays={colombianHolidays}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardsCald;
