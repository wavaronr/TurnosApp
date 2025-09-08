import React, { useState, useContext } from 'react';
import '../css/WeekDetail.css';
import AssignPersonModal from './AssignPersonModal.js';
import { useCalendar } from '../context/CalendarContext.js';
import { ProfileContext } from '../context/ProfileContext.js';
// Se elimina la importación de formatNames ya que la lógica se manejará localmente.

const ShiftSection = ({ title, people, onAdd, onRemove, profile }) => {
  // Lógica para generar nombres cortos únicos
  const getBaseShortName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return '';
    const parts = fullName.trim().toLowerCase().split(' ');
    if (parts.length < 2) return parts[0] || '';
    return `${parts[0].charAt(0)}${parts[1]}`;
  };

  const processedNames = people.reduce((acc, person) => {
    acc[person.id] = { base: getBaseShortName(person.name), fullName: person.name };
    return acc;
  }, {});

  const counts = people.reduce((acc, person) => {
    const baseName = processedNames[person.id].base;
    acc[baseName] = (acc[baseName] || 0) + 1;
    return acc;
  }, {});

  const finalShortNames = people.reduce((acc, person) => {
    const { base, fullName } = processedNames[person.id];
    if (counts[base] > 1) {
      const parts = fullName.trim().toLowerCase().split(' ');
      if (parts.length > 2) {
        // Si hay colisión y existe una tercera palabra, se añade su inicial.
        acc[person.id] = `${base}${parts[2].charAt(0)}`;
      } else {
        acc[person.id] = base; // No se puede resolver, se mantiene el base
      }
    } else {
      acc[person.id] = base;
    }
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

function DayCard({ day, people }) {
  const {
    colombianHolidays,
    shifts,
    assignShift,
    removeShift,
    getValidPeopleForShift
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
            profile={profile}
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
