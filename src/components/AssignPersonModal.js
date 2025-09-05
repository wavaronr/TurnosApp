import React from 'react';
import '../css/AssignPersonModal.css';

function AssignPersonModal({ people, existingPeopleIds, onSelect, onClose }) {
  const availablePeople = people.filter(p => !existingPeopleIds.includes(p.id));

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Asignar Persona</h5>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          {availablePeople.map(person => (
            <div key={person.id} onClick={() => onSelect(person)} className="person-item">
              {person.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssignPersonModal;
