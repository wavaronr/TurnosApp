import React, { useState, useMemo } from 'react';
import '../css/AssignPersonModal.css';
import { useCalendar } from '../context/CalendarContext.js';

// Accept the `people` prop from `DayCard.js`
function AssignPersonModal({ people, onAssign, onClose, initialDay, weekDays, shiftType }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedDays, setSelectedDays] = useState({ [initialDay.toISOString().split('T')[0]]: true });

  // We only need `isPersonValidForShift` from the context now.
  // The list of people comes directly from the props.
  const { isPersonValidForShift } = useCalendar();

  const filteredPeople = useMemo(() =>
    // Use the `people` prop, which is already filtered by the parent.
    Array.isArray(people)
      ? people.filter(person =>
          person && person.name && person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [],
    [people, searchTerm] // The dependency is now the `people` prop.
  );

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
            placeholder="Buscar persona..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="people-list-container">
            {/* This will now correctly display the filtered list from DayCard */}
            {filteredPeople.map(person => (
              <div 
                key={person.id} 
                className={`person-item-modal ${selectedPerson?.id === person.id ? 'selected' : ''}`}
                onClick={() => setSelectedPerson(person)}
              >
                {person.name}
              </div>
            ))}
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
