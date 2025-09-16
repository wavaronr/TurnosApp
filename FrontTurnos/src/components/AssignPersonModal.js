
import React, { useState, useMemo } from 'react';
import '../css/AssignPersonModal.css';
import { useCalendar } from '../context/CalendarContext.js';

// --- Funciones Helper --- (Lógica extraída para mayor claridad)

/**
 * Filtra una lista de personas basándose en un término de búsqueda (nombre, apellido o identificación).
 * @param {Array} people - La lista de personas a filtrar.
 * @param {string} searchTerm - El término a buscar.
 * @returns {Array} - La lista de personas filtrada.
 */
const filterPeople = (people, searchTerm) => {
  if (!Array.isArray(people)) return [];
  const trimmedSearchTerm = searchTerm.trim().toLowerCase();

  // Si el término de búsqueda está vacío, mostrar todas las personas válidas.
  if (trimmedSearchTerm === '') {
    return people;
  }

  return people.filter(person => {
    // Combina nombre y apellido para una búsqueda más completa
    const fullName = `${person?.name || ''} ${person?.apellido || ''}`.trim().toLowerCase();
    const idMatch = person?.identificacion?.toString().trim().toLowerCase().includes(trimmedSearchTerm);

    return fullName.includes(trimmedSearchTerm) || idMatch;
  });
};

// --- Componente Principal ---

function AssignPersonModal({ onAssign, onClose, initialDay, weekDays, shiftType }) {
  // --- Hooks de Estado y Contexto ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedDays, setSelectedDays] = useState({ [initialDay.toISOString().split('T')[0]]: true });

  const { isPersonValidForShift, getValidPeopleForShift } = useCalendar();

  // --- Memorización de Datos ---

  // Obtiene y memoriza la lista de personas válidas para este turno específico
  const validPeopleForShift = useMemo(() =>
    getValidPeopleForShift(initialDay, shiftType),
    [initialDay, shiftType, getValidPeopleForShift]
  );

  // Usa la función helper para filtrar las personas y memoriza el resultado
  const filteredPeople = useMemo(() =>
    filterPeople(validPeopleForShift, searchTerm),
    [validPeopleForShift, searchTerm]
  );

  // --- Manejadores de Eventos ---

  const handleDayChange = (date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDays(prev => ({ ...prev, [dateString]: !prev[dateString] }));
  };

  const handleAssignClick = () => {
    if (selectedPerson) {
      const daysToAssign = Object.entries(selectedDays)
        .filter(([, isSelected]) => isSelected)
        .map(([dateString]) => new Date(dateString));
      onAssign(selectedPerson, daysToAssign);
    }
  };

  // --- Renderizado ---

  const initialDayString = initialDay.toISOString().split('T')[0];

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
            placeholder="Buscar por nombre, apellido o ID..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="people-list-container">
            {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                    <div
                        key={person.id}
                        className={`person-item-modal ${selectedPerson?.id === person.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPerson(person)}
                    >
                        {/* Muestra nombre y apellido */}
                        {`${person.nombre || ''} ${person.apellido || ''}`.trim()}
                    </div>
                ))
            ) : (
                <div className="no-people-found">No se encontraron coincidencias.</div>
            )}
          </div>

          {selectedPerson && (
            <div className="day-selection-container">
              <h6>Repetir asignación en:</h6>
              <div className="day-checkbox-group">
                {weekDays.map(day => {
                  const dayString = day.toISOString().split('T')[0];
                  const isInitialDay = dayString === initialDayString;
                  const isDayValid = isPersonValidForShift(selectedPerson, day, shiftType);
                  const dayName = day.toLocaleDateString('es-ES', { weekday: 'short' });

                  return (
                    <label key={dayString} className={`day-checkbox-label ${!isDayValid && !isInitialDay ? 'disabled' : ''}`}>
                      <input
                        type="checkbox"
                        checked={!!selectedDays[dayString]}
                        onChange={() => handleDayChange(day)}
                        disabled={!isDayValid && !isInitialDay}
                      />
                      <span className="day-name-span">{dayName.replace('.', '')}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
           <button onClick={handleAssignClick} className="assign-btn" disabled={!selectedPerson}>
            Asignar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignPersonModal;
