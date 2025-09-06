import React, { useState } from 'react'; // Importar useState
import '../css/AssignPersonModal.css';

function AssignPersonModal({ people, existingPeopleIds, onSelect, onClose }) {
  // 1. Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Filtrar personas disponibles (lógica que ya existía)
  const availablePeople = people.filter(p => !existingPeopleIds.includes(p.id));

  // 3. Filtrar personas por el término de búsqueda (nueva lógica)
  const filteredPeople = availablePeople.filter(person =>
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
          {/* 4. Input para el buscador */}
          <input
            type="text"
            placeholder="Buscar persona..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* 5. Renderizar la lista filtrada */}
          <div className="people-list-container">
            {filteredPeople.map(person => (
              <div key={person.id} onClick={() => onSelect(person)} className="person-item">
                {person.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignPersonModal;
