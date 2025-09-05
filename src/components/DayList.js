import React from 'react';
import DayCard from './DayCard.js';
import { getWeekDays } from './getWeekDays.js';

function DayList({ selectedWeek, yearSet, colombianHolidays }) {
  if (!selectedWeek) {
    return null;
  }
  const weekDays = getWeekDays(selectedWeek, yearSet);

  return (
    <div>
      <h5>Días de la Semana:</h5>
      <ol>
        {weekDays.map((day) => (
          <DayCard key={day.toISOString()} day={day} colombianHolidays={colombianHolidays} />
        ))}
      </ol>
    </div>
  );
}

export default DayList;