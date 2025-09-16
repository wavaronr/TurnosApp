import React, { useContext } from 'react';
import DayList from './DayList.js';
import { useCalendar } from '../context/CalendarContext.js';
import { ProfileContext } from '../context/ProfileContext.js';
import { SaveIcon } from '../assets/icons.js';
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
            <SaveIcon />
            Guardar Cambios
          </button>
        </div>
      )}

      {selectedWeek && <DayList people={people} />}
    </div>
  );
}

export default WeekDetail;
