import React, { useState } from 'react';
import '../css/AssignPersonModal.css';

function AssignPersonModal({ people, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Asignar Persona</h5>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="Buscar persona..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="people-list-container">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div key={person.id} onClick={() => onSelect(person)} className="person-item-modal"> {/* CORRECTED CLASS NAME */}
                  {person.name}
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <p>No se encontraron personas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignPersonModal;
