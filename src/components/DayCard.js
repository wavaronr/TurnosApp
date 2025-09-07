import React, { useState } from 'react';
import '../css/WeekDetail.css';
import AssignPersonModal from './AssignPersonModal.js';
import { useCalendar } from '../context/CalendarContext.js';

const ShiftSection = ({ title, people, onAdd, onRemove, userProfile }) => (
  <div className="shift-section">
    <h6 className="shift-title">{title}</h6>
    <div className="people-list">
      {people.map(person => (
        <span key={person.id} className="person-pill">
          {person.name}
          {userProfile === 'ADM' && <button onClick={() => onRemove(person.id)} className="remove-person-btn">X</button>}
        </span>
      ))}
    </div>
    {userProfile === 'ADM' && <button onClick={onAdd} className="add-person-btn">+</button>}
  </div>
);

function DayCard({ day, people }) {
  const { 
    colombianHolidays, 
    shifts, 
    assignShift, 
    removeShift, 
    getValidPeopleForShift 
  } = useCalendar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [validPeople, setValidPeople] = useState([]);
  const userProfile = localStorage.getItem('profile'); // Get user profile

  const dayString = day.toISOString().split('T')[0];

  const dayShifts = shifts[dayString] || { morning: [], afternoon: [], night: [], off: [] };

  const dayOfMonth = day.getDate();
  const month = day.getMonth() + 1;
  const isHoliday = colombianHolidays.some(h => h.dia === dayOfMonth && h.mes === month);
  const dayName = day.toLocaleDateString('es-ES', { weekday: 'short' });

  const cardStyle = { ...(isHoliday && { backgroundColor: '#fdd' }), listStyle: 'none' };
  const dayNumberStyle = { ...(isHoliday && { color: 'red', fontWeight: 'bold' }) };

  const shiftTypes = [
    { id: 'morning', title: 'Mañana' },
    { id: 'afternoon', title: 'Tarde' },
    { id: 'night', title: 'Noche' },
    { id: 'off', title: 'Libre' },
  ];

  const handleAddPerson = (shiftType) => {
    const validPeopleForShift = getValidPeopleForShift(day, shiftType, people);
    setValidPeople(validPeopleForShift);
    setSelectedShift(shiftType);
    setIsModalOpen(true);
  };

  const handleSelectPerson = (person) => {
    assignShift(day, selectedShift, person);
    setIsModalOpen(false);
  };

  const handleRemovePerson = (shiftType, personId) => {
    removeShift(day, shiftType, personId);
  };

  return (
    <div className="day-card" style={cardStyle}>
      <div className="day-header">
        <div className="day-name">{dayName}</div>
        <div className="day-number" style={dayNumberStyle}>{dayOfMonth}</div>
      </div>
      <div className="shifts-container">
        {shiftTypes.map((shift) => (
          <ShiftSection
            key={shift.id}
            title={shift.title}
            people={dayShifts[shift.id]}
            onAdd={() => handleAddPerson(shift.id)}
            onRemove={(personId) => handleRemovePerson(shift.id, personId)}
            userProfile={userProfile}
          />
        ))}
      </div>

      {isModalOpen && (
        <AssignPersonModal
          people={validPeople}
          onSelect={handleSelectPerson}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default DayCard;
