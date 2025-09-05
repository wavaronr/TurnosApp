import React from 'react';
import DayList from './DayList';

function WeekDetail({ selectedWeek, yearSet, colombianHolidays, people }) {
  return (
    <div>
      {selectedWeek && (
        <DayList 
          selectedWeek={selectedWeek} 
          yearSet={yearSet} 
          colombianHolidays={colombianHolidays}
          people={people} // Pasa las personas a DayList
        />
      )}
    </div>
  );
}

export default WeekDetail;