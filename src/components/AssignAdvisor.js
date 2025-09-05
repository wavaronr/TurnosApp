import React, { useState } from 'react';

function AssignAdvisor({ advisors, selectedWeek, onAssign }) {
  const [selectedAdvisor, setSelectedAdvisor] = useState('');

  const handleAssign = () => {
    if (selectedAdvisor) {
      onAssign(selectedAdvisor, selectedWeek);
      setSelectedAdvisor('');
    }
  };

  return (
    <div>
      <h5>Asignar Asesor</h5>
      <select
        value={selectedAdvisor}
        onChange={(e) => setSelectedAdvisor(e.target.value)}
      >
        <option value="">Selecciona un asesor</option>
        {advisors.map((advisor) => (
          <option key={advisor.id} value={advisor.id}>
            {advisor.name}
          </option>
        ))}
      </select>
      <button onClick={handleAssign}>Asignar</button>
    </div>
  );
}

export default AssignAdvisor;
