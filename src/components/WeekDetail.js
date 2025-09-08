import React, { useContext } from 'react';
import DayList from './DayList.js';
import { useCalendar } from '../context/CalendarContext.js';
import { ProfileContext } from '../context/ProfileContext.js';
import '../css/WeekDetail.css'; // Asegúrate de importar el CSS

function WeekDetail() { 
  const { 
    selectedWeek, 
    people,
    isDirty,
    saveTemporarySchedule
  } = useCalendar(); 
  const { profile } = useContext(ProfileContext);

  return (
    <div>
      {profile?.role === 'ADM' && isDirty && (
        <div className="d-flex justify-content-end mb-3">
          {/* Botón con la nueva clase personalizada */}
          <button onClick={saveTemporarySchedule} className="btn-save-changes">
            Guardar Cambios
          </button>
        </div>
      )}

      {selectedWeek && <DayList people={people} />}
    </div>
  );
}

export default WeekDetail;
