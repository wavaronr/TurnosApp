import React, { useState } from 'react';
import ProgrammingCalendar from '../components/ProgrammingCalendar.js';
import '../css/Programming.css';

function Programming() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="programming-container">
      <div className="programming-header">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <h2>
          {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>
      <ProgrammingCalendar date={currentDate} />
    </div>
  );
}

export default Programming;
