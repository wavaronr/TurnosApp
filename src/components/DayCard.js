import React from 'react';
import '../css/WeekDetail.css';

function DayCard({ day }) {
  return (
    <li className="day-card">
      <div className="day-name">{day.dayName}</div>
      <div className="day-number">{ day.day}</div>
    </li>
  );
}

export default DayCard;
