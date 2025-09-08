import React, { useContext } from 'react';
import DayList from './DayList.js';
import { useCalendar } from '../context/CalendarContext.js';
import { ProfileContext } from '../context/ProfileContext.js';

function WeekDetail() { 
  const { 
    selectedWeek, 
    people,
    programmedSchedule,
    temporarySchedule,
    saveTemporarySchedule
  } = useCalendar(); 
  const { profile } = useContext(ProfileContext);

  // Comprobar si hay cambios pendientes
  const hasChanges = JSON.stringify(programmedSchedule) !== JSON.stringify(temporarySchedule);

  return (
    <div>
      {/* Botón para guardar cambios (visible para ADM y si hay cambios) */}
      {profile?.role === 'ADM' && hasChanges && (
        <div className="d-grid gap-2 mb-3">
          <button onClick={saveTemporarySchedule} className="btn btn-success">
            Guardar Cambios
          </button>
        </div>
      )}

      {selectedWeek && <DayList people={people} />}
    </div>
  );
}

export default WeekDetail;
