import React, { useContext } from 'react';
import DayList from './DayList.js';
import { useCalendar } from '../context/CalendarContext.js';
import { ProfileContext } from '../context/ProfileContext.js';
import '../css/WeekDetail.css';

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
          <button onClick={saveTemporarySchedule} className="btn-save-changes">
            {/* Icono SVG de Guardar */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338A2.25 2.25 0 0017.088 3.75H15M12 3.75v12m-3-3l3 3 3-3" />
            </svg>
            Guardar Cambios
          </button>
        </div>
      )}

      {selectedWeek && <DayList people={people} />}
    </div>
  );
}

export default WeekDetail;
