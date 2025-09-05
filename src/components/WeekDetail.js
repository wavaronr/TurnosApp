import React, { useState, useEffect } from 'react';
import { getWeekDays } from './getWeekDays';
import { advisors as initialAdvisors } from './advisorsData';
import AdvisorList from './AdvisorList';
import AssignAdvisor from './AssignAdvisor';
import './../css/WeekDetail.css'; // Importa el archivo CSS para los estilos

function WeekDetail({ selectedWeek, yearSet }) {
  const [advisors, setAdvisors] = useState(initialAdvisors);

  useEffect(() => {
    setAdvisors(initialAdvisors);
  }, [selectedWeek]);

  if (!selectedWeek) {
    return <div>Selecciona una semana para ver los detalles.</div>;
  }

  const handleAssignAdvisor = (advisorId, week) => {
    const advisor = advisors.find((a) => a.id === parseInt(advisorId));
    if (advisor && !advisor.assignedWeeks.includes(week)) {
      const updatedAdvisors = advisors.map((a) =>
        a.id === parseInt(advisorId)
          ? { ...a, assignedWeeks: [...a.assignedWeeks, week] }
          : a
      );
      setAdvisors(updatedAdvisors);
    }
  };

  const weekDays = getWeekDays(selectedWeek, yearSet);
  const assignedAdvisors = advisors.filter((advisor) =>
    advisor.assignedWeeks.includes(selectedWeek)
  );
  const unassignedAdvisors = advisors.filter(
    (advisor) => !advisor.assignedWeeks.includes(selectedWeek)
  );
  const daysTitle = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  return (
    <div>
      <h4>Semana {selectedWeek}</h4>
      <AdvisorList advisors={assignedAdvisors} />
      <AssignAdvisor
        advisors={unassignedAdvisors}
        selectedWeek={selectedWeek}
        onAssign={handleAssignAdvisor}
      />
      <ol className="week-detail-container">
        {weekDays.map((day, index) => (
          <li key={index} className="day-card">
            <div className="day-name">{daysTitle[index]}</div>
            <div>{day.dayNumber}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default WeekDetail;
