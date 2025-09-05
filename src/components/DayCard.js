import React from 'react';
import '../css/WeekDetail.css';

function DayCard({ day, colombianHolidays }) {
  const dayOfMonth = day.getDate();
  const month = day.getMonth() + 1;

  const isHoliday = colombianHolidays.some(
    (festivo) => festivo.dia === dayOfMonth && festivo.mes === month
  );

  const dayName = day.toLocaleDateString('es-ES', { weekday: 'short' });

  const cardStyle = {
    ...(isHoliday && { backgroundColor: '#fdd' }), 
    listStyle: 'none'
  };

  const dayNumberStyle = {
    ...(isHoliday && { color: 'red', fontWeight: 'bold' }),
  }

  return (
    <div className="day-card" style={cardStyle}>
      <div className="day-name">{dayName}</div>
      <div className="day-number" style={dayNumberStyle}>{dayOfMonth}</div>
    </div>
  );
}

export default DayCard;