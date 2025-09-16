import React, { useState } from 'react';
import '../css/DayOffcanvas.css';
import AssignPersonModal from './AssignPersonModal';
import { useCalendar } from '../context/CalendarContext';

const ShiftCard = ({ title, people, onAdd, onRemove, day, shiftType }) => (
  <div className="shift-card">
    <h4 className="shift-title">{title}</h4>
    <div className="people-list">
      {people.map(person => (
        <span key={person.id} className="person-pill">
          {person.name}
          <button onClick={() => onRemove(day, shiftType, person.id)} className="remove-person-btn">×</button>
        </span>
      ))}
    </div>
    <button onClick={onAdd} className="add-person-btn">+ Asignar Persona</button>
  </div>
);

function DayOffcanvas({ day, month, year, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);
  const { shifts, removeShift, assignShifts, getWeekDays, selectedWeek } = useCalendar();

  const dayObject = new Date(year, month, day);
  const dayString = dayObject.toISOString().split('T')[0];
  const dayShifts = shifts[dayString] || { morning: [], afternoon: [], night: [], off: [] };

  const weekDays = selectedWeek ? getWeekDays(selectedWeek, year) : [dayObject];

  const handleAdd = (shift) => {
    setCurrentShift(shift);
    setIsModalOpen(true);
  };

  const handleAssign = (person, days) => {
    assignShifts(person, days, currentShift);
    setIsModalOpen(false);
    setCurrentShift(null);
  };

  return (
    <div className="offcanvas-overlay" onClick={onClose}>
      <div className="offcanvas-content" onClick={(e) => e.stopPropagation()}>
        <div className="offcanvas-header">
          <h2>{`Horarios para el ${day}/${month + 1}/${year}`}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="offcanvas-body">
          <ShiftCard 
            title="Mañana" 
            people={dayShifts.morning}
            onAdd={() => handleAdd('morning')}
            onRemove={removeShift}
            day={dayObject}
            shiftType="morning"
          />
          <ShiftCard 
            title="Tarde" 
            people={dayShifts.afternoon}
            onAdd={() => handleAdd('afternoon')}
            onRemove={removeShift}
            day={dayObject}
            shiftType="afternoon"
          />
          <ShiftCard 
            title="Noche" 
            people={dayShifts.night}
            onAdd={() => handleAdd('night')}
            onRemove={removeShift}
            day={dayObject}
            shiftType="night"
          />
          <ShiftCard 
            title="Descanso" 
            people={dayShifts.off}
            onAdd={() => handleAdd('off')}
            onRemove={removeShift}
            day={dayObject}
            shiftType="off"
          />
        </div>

        {isModalOpen && (
          <AssignPersonModal
            onClose={() => setIsModalOpen(false)}
            onAssign={handleAssign}
            initialDay={dayObject}
            weekDays={weekDays}
            shiftType={currentShift}
          />
        )}
      </div>
    </div>
  );
}

export default DayOffcanvas;
