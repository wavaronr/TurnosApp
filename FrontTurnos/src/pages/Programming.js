import React from 'react';
import ProgrammingCalendar from '../components/ProgrammingCalendar.js';
import { useCalendar } from '../context/CalendarContext.js';
import '../css/Programming.css';

function Programming() {
  const { yearSet, setYearSet, monthCalendario, setMonthCalendario } = useCalendar();

  const goToPreviousMonth = () => {
    if (monthCalendario === 0) {
      setMonthCalendario(11);
      setYearSet(yearSet - 1);
    } else {
      setMonthCalendario(monthCalendario - 1);
    }
  };

  const goToNextMonth = () => {
    if (monthCalendario === 11) {
      setMonthCalendario(0);
      setYearSet(yearSet + 1);
    } else {
      setMonthCalendario(monthCalendario + 1);
    }
  };

  const currentDate = new Date(yearSet, monthCalendario);

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
