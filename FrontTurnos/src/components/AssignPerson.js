import React, { useState } from 'react';

function AssignPerson({ persons, selectedWeek, onAssign }) {
  const [selectedPerson, setSelectedPerson] = useState('');

  const handleAssign = () => {
    if (selectedPerson) {
      onAssign(selectedPerson, selectedWeek);
      setSelectedPerson('');
    }
  };

  return (
    <div>
      <h5>Asignar Persona</h5>
      <select
        value={selectedPerson}
        onChange={(e) => setSelectedPerson(e.target.value)}
      >
        <option value="">Selecciona una persona</option>
        {persons.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>
      <button onClick={handleAssign}>Asignar</button>
    </div>
  );
}

export default AssignPerson;
