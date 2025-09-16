import React, { useState, useContext } from 'react';
import '../css/WeekDetail.css';
import AssignPersonModal from './AssignPersonModal.js';
import { useCalendar } from '../context/CalendarContext.js';
import { ProfileContext } from '../context/ProfileContext.js';
import { createShortName } from '../utils/textUtils.js'; // Importamos la función centralizada

const ShiftSection = ({ title, people, onAdd, onRemove, profile }) => {
  // Usamos la nueva función de utilidad para generar las siglas
  const finalShortNames = people.reduce((acc, person) => {
    // Pasamos las siglas que ya existen (`Object.values(acc)`) para evitar colisiones
    acc[person.id] = createShortName(person.name, Object.values(acc));
    return acc;
  }, {});

  return (
    <div className="shift-section">
      <h6 className="shift-title">{title}</h6>
      <div className="people-list">
        {people.map(person => (
          <span key={person.id} className="person-pill" title={person.name}>
            {finalShortNames[person.id]}
            {profile?.role === 'ADM' && <button onClick={() => onRemove(person.id)} className="remove-person-btn">X</button>}
          </span>
        ))}
      </div>
      {profile?.role === 'ADM' && <button onClick={onAdd} className="add-person-btn">+</button>}
    </div>
  );
};

function DayCard({ day, people, weekDays }) {
  const {
    colombianHolidays,
    shifts,
    assignShifts,
    removeShift,
    getValidPeopleForShift,
  } = useCalendar();
  const { profile } = useContext(ProfileContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [validPeople, setValidPeople] = useState([]);

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
    const validPeopleForShift = getValidPeopleForShift(day, shiftType);
    setValidPeople(validPeopleForShift);
    setSelectedShift(shiftType);
    setIsModalOpen(true);
  };

  const handleAssignToDays = (person, selectedDays) => {
    assignShifts(person, selectedDays, selectedShift);
    setIsModalOpen(false);
  };
  
  const handleRemovePerson = (shiftType, personId) => {
    removeShift(day, shiftType, personId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
            profile={profile}
          />
        ))}
      </div>

      {isModalOpen && (
        <AssignPersonModal
          people={validPeople}
          onAssign={handleAssignToDays} 
          onClose={handleCloseModal}
          initialDay={day}
          weekDays={weekDays}
          shiftType={selectedShift}
        />
      )}
    </div>
  );
}

export default DayCard;
