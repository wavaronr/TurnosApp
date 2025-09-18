
import React, { useContext } from 'react';
import { DayList } from './DayList.js'; // CORRECCIÓN: Usar importación nombrada
import { useCalendar } from '../context/CalendarContext.js';
import { ProfileContext } from '../context/ProfileContext.js';
import { SaveIcon, SpinnerIcon } from '../assets/icons.js';
import '../css/WeekDetail.css';

// CORRECCIÓN: Usar exportación nombrada
export const WeekDetail = () => { 
  const { 
    selectedWeek, 
    isDirty,
    isLoading,
    saveSchedule, 
  } = useCalendar(); 
  const { profile } = useContext(ProfileContext);
 
  return (
    <div>
      {profile?.role === 'ADM' && isDirty && (
        <div className="d-flex justify-content-end mb-3">
          <button onClick={saveSchedule} className="btn-save-changes" disabled={isLoading}>
            {isLoading ? (
              <><SpinnerIcon /> Guardando...</>
            ) : (
              <><SaveIcon /> Guardar Cambios</>
            )}
          </button>
        </div>
      )}

      {selectedWeek && <DayList />}
    </div>
  );
}
