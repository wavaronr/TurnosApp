import React, { useState } from 'react';

function AssignPerson({ people, selectedWeek, onAssign }) {
  const [selectedPerson, setSelectedPerson] = useState('');

//console.log(people)

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
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.nombre}
          </option>
        ))}
      </select>
      <button onClick={handleAssign}>Asignar</button>
    </div>
  );
}

export default AssignPerson;
