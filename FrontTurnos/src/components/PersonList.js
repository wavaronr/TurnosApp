import React from 'react';

function PersonList({ persons }) {
  return (
    <div>
      <h5>Personas Asignadas:</h5>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>{person.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default PersonList;
