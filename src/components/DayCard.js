import React, { useState } from 'react';
import '../css/WeekDetail.css';
import AssignPersonModal from './AssignPersonModal'; // Importa el modal

const ShiftSection = ({ title, people, onAdd, onRemove }) => (
  <div className="shift-section">
    <h6 className="shift-title">{title}</h6>
    <div className="people-list">
      {people.map(person => (
        <span key={person.id} className="person-pill">
          {person.name}
          <button onClick={() => onRemove(person.id)} className="remove-person-btn">X</button>
        </span>
      ))}
    </div>
    <button onClick={onAdd} className="add-person-btn">+</button>
  </div>
);

function DayCard({ day, colombianHolidays, people }) { // Recibe la lista de personas
  const [shifts, setShifts] = useState({
    morning: [],
    afternoon: [],
    night: [],
    off: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

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

  const handleAddPerson = (shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };

  const handleRemovePerson = (shift, personId) => {
    setShifts(prevShifts => ({
      ...prevShifts,
      [shift]: prevShifts[shift].filter(p => p.id !== personId)
    }));
  };

  const handleSelectPerson = (person) => {
    setShifts(prevShifts => ({
      ...prevShifts,
      [selectedShift]: [...prevShifts[selectedShift], person]
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="day-card" style={cardStyle}>
      <div className="day-header">
        <div className="day-name">{dayName}</div>
        <div className="day-number" style={dayNumberStyle}>{dayOfMonth}</div>
      </div>
      <div className="shifts-container">
        <ShiftSection
          title="Mañana"
          people={shifts.morning}
          onAdd={() => handleAddPerson('morning')}
          onRemove={(personId) => handleRemovePerson('morning', personId)}
        />
        <ShiftSection
          title="Tarde"
          people={shifts.afternoon}
          onAdd={() => handleAddPerson('afternoon')}
          onRemove={(personId) => handleRemovePerson('afternoon', personId)}
        />
        <ShiftSection
          title="Noche"
          people={shifts.night}
          onAdd={() => handleAddPerson('night')}
          onRemove={(personId) => handleRemovePerson('night', personId)}
        />
        <ShiftSection
          title="Libre"
          people={shifts.off}
          onAdd={() => handleAddPerson('off')}
          onRemove={(personId) => handleRemovePerson('off', personId)}
        />
      </div>

      {isModalOpen && (
        <AssignPersonModal
          people={people}
          existingPeopleIds={shifts[selectedShift].map(p => p.id)}
          onSelect={handleSelectPerson}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default DayCard;
