
import React, { useState } from 'react';
import '../css/DayOffcanvas.css';
import AssignPersonModal from './AssignPersonModal';
import { advisors as persons } from './personsData'; // Corregido

const ShiftCard = ({ title, people, onAdd, onRemove }) => (
  <div className="shift-card">
    <h4 className="shift-title">{title}</h4>
    <div className="people-list">
      {people.map(person => (
        <span key={person.id} className="person-pill">
          {person.name}
          <button onClick={() => onRemove(person.id)} className="remove-person-btn">×</button>
        </span>
      ))}
    </div>
    <button onClick={onAdd} className="add-person-btn">+ Asignar Persona</button>
  </div>
);

function DayOffcanvas({ day, month, year, onClose, shifts, onUpdateShifts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);

  const handleAdd = (shift) => {
    setCurrentShift(shift);
    setIsModalOpen(true);
  };

  const handleRemove = (personId, shift) => {
    const updatedShift = shifts[shift].filter(p => p.id !== personId);
    onUpdateShifts({ ...shifts, [shift]: updatedShift });
  };

  const handleSelectPerson = (person) => {
    if (currentShift) {
      const updatedShift = [...shifts[currentShift], person];
      onUpdateShifts({ ...shifts, [currentShift]: updatedShift });
    }
    setIsModalOpen(false);
    setCurrentShift(null);
  };

  return (
    <div className="offcanvas-overlay" onClick={onClose}>
      <div className="offcanvas-content" onClick={(e) => e.stopPropagation()}>
        <div className="offcanvas-header">
          <h2>{`Horarios para el ${day}/${month + 1}/${year}`}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="offcanvas-body">
          <ShiftCard 
            title="Mañana" 
            people={shifts.morning}
            onAdd={() => handleAdd('morning')}
            onRemove={(personId) => handleRemove(personId, 'morning')}
          />
          <ShiftCard 
            title="Tarde" 
            people={shifts.afternoon}
            onAdd={() => handleAdd('afternoon')}
            onRemove={(personId) => handleRemove(personId, 'afternoon')}
          />
          <ShiftCard 
            title="Noche" 
            people={shifts.night}
            onAdd={() => handleAdd('night')}
            onRemove={(personId) => handleRemove(personId, 'night')}
          />
          <ShiftCard 
            title="Descanso" 
            people={shifts.off}
            onAdd={() => handleAdd('off')}
            onRemove={(personId) => handleRemove(personId, 'off')}
          />
        </div>

        {isModalOpen && (
          <AssignPersonModal
            people={persons}
            existingPeopleIds={currentShift ? shifts[currentShift].map(p => p.id) : []}
            onSelect={handleSelectPerson}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default DayOffcanvas;
