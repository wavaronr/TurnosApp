import React from 'react';

function AdvisorList({ advisors }) {
  return (
    <div>
      <h5>Asesores Asignados:</h5>
      <ul>
        {advisors.map((advisor) => (
          <li key={advisor.id}>{advisor.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdvisorList;
