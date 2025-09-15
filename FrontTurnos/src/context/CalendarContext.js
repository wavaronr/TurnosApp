import React, { createContext, useState, useEffect, useContext } from 'react';
import { holidays as getColombianHolidays } from '../utils/holidays.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import { capitalize } from '../utils/textUtils.js';

export const CalendarContext = createContext();

export const useCalendar = () => {
  return useContext(CalendarContext);
};

// El provider ahora acepta addNotification como una prop
export const CalendarProvider = ({ children, addNotification }) => {
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [people, setPeople] = useState([]);

  const [programmedSchedule, setProgrammedSchedule] = useState({});
  const [temporarySchedule, setTemporarySchedule] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetch('/api/personas')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos de las personas');
        }
        return response.json();
      })
      .then(data => {
        const adaptedData = data.map(person => ({ ...person, id: person._id }));
        setPeople(adaptedData);
      })
      .catch(error => {
        console.error('Error fetching people data:', error);
        // Aquí podríamos usar una notificación si tuviéramos acceso a ella
        setPeople([]);
      });

    setProgrammedSchedule({});
    setTemporarySchedule({});
    setIsDirty(false);
  }, []);

  const savePerson = async (personData, personIdForUpdate) => {
    if (personIdForUpdate) {
      try {
        const response = await fetch(`/api/personas/${personIdForUpdate}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(personData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar la persona');
        }

        const updatedPerson = await response.json();
        const adaptedPerson = { ...updatedPerson, id: updatedPerson._id };

        setPeople(people.map(p => (p.id === adaptedPerson.id ? adaptedPerson : p)));
        addNotification('Perfil actualizado exitosamente', 'success');

      } catch (error) {
        console.error('Error updating person:', error);
        addNotification(`Error: ${error.message}`, 'error');
      }
    } else {
      try {
        const response = await fetch('/api/personas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(personData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al crear la persona');
        }

        const savedPersonResponse = await response.json();
        const savedPerson = savedPersonResponse.persona;
        const adaptedPerson = { ...savedPerson, id: savedPerson._id };

        setPeople(prevPeople => [...prevPeople, adaptedPerson]);
        addNotification('¡Persona creada exitosamente!', 'success');

      } catch (error) {
        console.error('Error saving person:', error);
        addNotification(`Error: ${error.message}`, 'error');
      }
    }
  };

  const deletePerson = async (personId) => {
    try {
      const response = await fetch(`/api/personas/${personId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el perfil');
      }

      setPeople(people.filter(p => p.id !== personId));
      addNotification('Perfil eliminado exitosamente', 'success');

    } catch (error) {
      console.error('Error deleting person:', error);
      addNotification(`Error: ${error.message}`, 'error');
    }
  };

  // ... (resto de las funciones que no usan alert)

  useEffect(() => {
    const fetchHolidays = async () => {
      const holidays = await getColombianHolidays(yearSet);
      setColombianHolidays(holidays);
    };
    fetchHolidays();
  }, [yearSet]);

  const assignShifts = (person, days, shiftType) => {
    setTemporarySchedule(currentSchedule => {
      const newShifts = JSON.parse(JSON.stringify(currentSchedule));
      days.forEach(day => {
        if (isPersonValidForShift(person, day, shiftType, newShifts)) {
          const dayString = day.toISOString().split('T')[0];
          if (!newShifts[dayString]) {
            newShifts[dayString] = { morning: [], afternoon: [], night: [], off: [] };
          }
          const personExists = newShifts[dayString][shiftType].some(p => p.id === person.id);
          if (!personExists) {
            newShifts[dayString][shiftType].push(person);
          }
        }
      });
      return newShifts;
    });
    setIsDirty(true);
  };

  const assignShift = (day, shiftType, person) => {
    assignShifts(person, [day], shiftType);
  };

  const removeShift = (day, shiftType, personId) => {
    setTemporarySchedule(currentSchedule => {
      const newShifts = JSON.parse(JSON.stringify(currentSchedule));
      const dayString = day.toISOString().split('T')[0];
      if (newShifts[dayString] && newShifts[dayString][shiftType]) {
        newShifts[dayString][shiftType] = newShifts[dayString][shiftType].filter(p => p.id !== personId);
      }
      return newShifts;
    });
    setIsDirty(true);
  };

  const saveTemporarySchedule = () => {
    setProgrammedSchedule(temporarySchedule);
    setIsDirty(false);
    addNotification('Cambios de turno guardados localmente', 'success');
    console.log("Cambios guardados:", temporarySchedule);
  };

  const isPersonValidForShift = (person, day, shiftType, schedule = temporarySchedule) => {
    const dayString = day.toISOString().split('T')[0];
    
    if (!selectedWeek) {
      return true;
    }

    const weekDays = getWeekDays(selectedWeek, yearSet).map(d => d.toISOString().split('T')[0]);

    const shiftsToday = schedule[dayString] || {};
    for (const sType in shiftsToday) {
      if (shiftsToday[sType].some(p => p.id === person.id)) return false;
    }
    
    const yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    const shiftsYesterday = schedule[yesterdayString] || {};
    if (shiftsYesterday.night?.some(p => p.id === person.id)) {
      if (shiftType !== 'night' && shiftType !== 'off') return false;
    }

    let workShiftCount = 0;
    weekDays.forEach(weekDayString => {
      const dayShifts = schedule[weekDayString] || {};
      ['morning', 'afternoon', 'night'].forEach(workShiftType => {
        if (dayShifts[workShiftType]?.some(p => p.id === person.id)) workShiftCount++;
      });
    });

    if (workShiftCount >= 6 && shiftType !== 'off') return false;

    return true;
  };

  const getValidPeopleForShift = (day, shiftType) => {
    return people.filter(person => isPersonValidForShift(person, day, shiftType));
  };


  const value = {
    yearSet,
    setYearSet,
    monthCalendario,
    setMonthCalendario,
    colombianHolidays,
    selectedWeek,
    setSelectedWeek,
    shifts: temporarySchedule,
    assignShift,
    assignShifts,
    removeShift,
    saveTemporarySchedule,
    isDirty,
    getValidPeopleForShift,
    isPersonValidForShift,
    people,
    savePerson,
    deletePerson,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};