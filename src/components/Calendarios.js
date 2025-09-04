import React, { useEffect, useState } from 'react';
import '../css/calendario.css';

import { holidays } from './holidays.js';
import DaysCalendar from './DaysCalendar.js';
import WeekCount from './WeekCount.js';

function
 Calendarios({ monthCalendario, yearSet, setWeekNumber }) {
  const [colombianHolidays, setColombianHolidays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const holidaysData = await holidays(yearSet);
      setColombianHolidays(holidaysData);
    };

    fetchData();
  }, [yearSet]);

  const countDays = new Date(yearSet, monthCalendario + 1, 0).getDate();
  const days = Array.from({ length: countDays }, (_, index) => index + 1);
  const daysTitle = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  return (
    <div className="calendar">
      <WeekCount
        monthCalendario={monthCalendario}
        yearSet={yearSet}
        setWeekNumber={setWeekNumber}
      />
      <ol className="ol">
        {daysTitle.map((dayL, index) => (
          <li
            className={`dayLetter`}
            key={dayL}
          >
            {dayL}
          </li>
        ))}

        {days.map((day) => (
          <DaysCalendar
            key={day}
            day={day}
            colombianHolidays={colombianHolidays}
            monthCalendario={monthCalendario}
            yearSet={yearSet}
          />
        ))}
      </ol>
    </div>
  );
}

export default Calendarios;