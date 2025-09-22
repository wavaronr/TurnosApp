
import React, { createContext, useState, useEffect, useContext } from 'react';
import { holidays as getColombianHolidays } from '../utils/holidays.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import { capitalize } from '../utils/textUtils.js';
import { getPeople, savePerson as savePersonService, deletePerson as deletePersonService } from '../services/peopleService.js';
import { getProgramming, saveProgramming } from '../services/programmingService.js';

export const CalendarContext = createContext();

export const useCalendar = () => {
  return useContext(CalendarContext);
};

export const CalendarProvider = ({ children, addNotification }) => {
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [people, setPeople] = useState([]);
  const [shifts, setShifts] = useState({});

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const data = await getPeople();
        const adaptedData = data.map(person => ({
          ...person,
          id: person._id,
          name: `${person.nombre || ''} ${person.apellido || ''}`.trim()
        }));
        setPeople(adaptedData);
      } catch (error) {
        console.error('Error fetching people data:', error);
        addNotification('Error al obtener los datos de las personas', 'error');
        setPeople([]);
      }
    };

    fetchPeople();
  }, []);

  useEffect(() => {
    const fetchProgramming = async () => {
      try {
        const programming = await getProgramming(yearSet, monthCalendario + 1); 
        setShifts(programming.schedule || {});
      } catch (error) {
        console.error('Error fetching programming:', error);
        addNotification('Error al cargar la programación', 'error');
      }
    };

    fetchProgramming();
  }, [yearSet, monthCalendario]);

  const saveShifts = async (newShifts) => {
    try {
      await saveProgramming(yearSet, monthCalendario + 1, newShifts);
      addNotification('Programación guardada exitosamente', 'success');
    } catch (error) {
      addNotification('Error al guardar la programación', 'error');
    }
  };  
  const savePerson = async (personData, personIdForUpdate) => {
    try {
      const savedOrUpdatedResponse = await savePersonService(personData, personIdForUpdate);
      // FIX: Handle different server responses for CREATE vs UPDATE
      const rawPerson = personIdForUpdate ? savedOrUpdatedResponse : savedOrUpdatedResponse.persona;

      const adaptedPerson = {
        ...rawPerson,
        id: rawPerson._id,
        name: `${rawPerson.nombre || ''} ${rawPerson.apellido || ''}`.trim(),
        routeConfig: rawPerson.routeConfig
      };
      
      if (personIdForUpdate) {
        setPeople(people.map(p => (p.id === adaptedPerson._id ? adaptedPerson : p)));
        addNotification('Perfil actualizado exitosamente', 'success');
      } else {
        setPeople(prevPeople => [...prevPeople, adaptedPerson]);
        addNotification('¡Persona creada exitosamente!', 'success');
      }
    } catch (error) {
      addNotification(`Error: ${error.message}`, 'error');
    }
  };

  const deletePerson = async (personId) => {
    try {
      await deletePersonService(personId);
      setPeople(people.filter(p => p.id !== personId));
      addNotification('Perfil eliminado exitosamente', 'success');
    } catch (error) {
      addNotification(`Error: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      const holidays = await getColombianHolidays(yearSet);
      setColombianHolidays(holidays);
    };
    fetchHolidays();
  }, [yearSet]);

  const assignShifts = (person, days, shiftType) => {
    const newShifts = JSON.parse(JSON.stringify(shifts));
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
    setShifts(newShifts);
    saveShifts(newShifts);
    addNotification('Turno asignado exitosamente.', 'success');
  };

  const assignShift = (day, shiftType, person) => {
    assignShifts(person, [day], shiftType);
  };

  const removeShift = (day, shiftType, personId) => {
    const newShifts = JSON.parse(JSON.stringify(shifts));
    const dayString = day.toISOString().split('T')[0];
    if (newShifts[dayString] && newShifts[dayString][shiftType]) {
      newShifts[dayString][shiftType] = newShifts[dayString][shiftType].filter(p => p.id !== personId);
    }
    setShifts(newShifts);
    saveShifts(newShifts);
    addNotification('Turno eliminado exitosamente.', 'success');
  };

  const isPersonValidForShift = (person, day, shiftType, schedule = shifts) => {
    const dayString = day.toISOString().split('T')[0];
    
    if (!selectedWeek) {
      return true; 
    }

    const weekDays = getWeekDays(selectedWeek, yearSet).map(d => d.toISOString().split('T')[0]);

    const shiftsToday = schedule[dayString] || {};
    for (const sType in shiftsToday) {
      if (sType !== shiftType && shiftsToday[sType].some(p => p.id === person.id)) {
        return false;
      }
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
    shifts,
    assignShift,
    assignShifts,
    removeShift,
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
