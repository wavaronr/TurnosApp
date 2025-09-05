import React from 'react';
import DayList from './DayList';

function WeekDetail({ selectedWeek, yearSet, colombianHolidays }) {
  return (
    <div>
      {selectedWeek && (
        <DayList selectedWeek={selectedWeek} yearSet={yearSet} colombianHolidays={colombianHolidays} />
      )}
    </div>
  );
}

export default WeekDetail;