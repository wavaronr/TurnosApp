import React from 'react';
import '../css/calendario.css';

import Calendarios from './Calendarios.js';
import YearInput from './yearinput';

function CardsCald({ setSelectedWeek, yearSet, setYearSet, setMonthCalendario }) {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

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
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardsCald;
