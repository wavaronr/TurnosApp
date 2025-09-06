import React, { useState } from 'react';
import '../css/AssignPersonModal.css';

// El modal ahora recibe una lista de personas ya validadas.
// Se elimina la prop `existingPeopleIds`.
function AssignPersonModal({ people, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  // La única lógica de filtrado que queda es la del buscador.
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
            {/* Se muestra un mensaje si no hay personas válidas o no hay resultados de búsqueda */}
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div key={person.id} onClick={() => onSelect(person)} className="person-item">
                  {person.name}
                </div>
              ))
            ) : (
              <div className="no-results">No hay personas disponibles o que coincidan con la búsqueda.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignPersonModal;
