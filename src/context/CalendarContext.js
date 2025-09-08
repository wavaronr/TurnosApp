import React, { createContext, useState, useEffect, useContext } from 'react';
import { holidays as getColombianHolidays } from '../utils/holidays.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import peopleData from '../data/dataPerson.json' with { type: 'json' };
import initialSchedule from '../data/september2025.json' with { type: 'json' };

export const CalendarContext = createContext();

export const useCalendar = () => {
  return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [people, setPeople] = useState([]);

  // --- Nuevos Estados ---
  const [programmedSchedule, setProgrammedSchedule] = useState({});
  const [temporarySchedule, setTemporarySchedule] = useState({});
  // ---------------------

  useEffect(() => {
    setPeople(peopleData);
    // Cargar la programación inicial
    setProgrammedSchedule(initialSchedule.days);
    setTemporarySchedule(initialSchedule.days);
  }, []);

  const savePerson = (personData) => {
    if (personData.id) {
      setPeople(people.map(p => p.id === personData.id ? personData : p));
    } else {
      const newId = people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1;
      setPeople([...people, { ...personData, id: newId }]);
    }
  };

  const deletePerson = (personId) => {
    setPeople(people.filter(p => p.id !== personId));
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      const holidays = await getColombianHolidays(yearSet);
      setColombianHolidays(holidays);
    };
    fetchHolidays();
  }, [yearSet]);
  
  const assignShift = (day, shiftType, person) => {
    const dayString = day.toISOString().split('T')[0];
    const newShifts = JSON.parse(JSON.stringify(temporarySchedule)); // Modificar copia
    if (!newShifts[dayString]) {
      newShifts[dayString] = { morning: [], afternoon: [], night: [], off: [] };
    }
    newShifts[dayString][shiftType].push(person);
    setTemporarySchedule(newShifts); // Actualizar estado temporal
  };

  const removeShift = (day, shiftType, personId) => {
    const dayString = day.toISOString().split('T')[0];
    const newShifts = JSON.parse(JSON.stringify(temporarySchedule)); // Modificar copia
    if (newShifts[dayString] && newShifts[dayString][shiftType]) {
      newShifts[dayString][shiftType] = newShifts[dayString][shiftType].filter(p => p.id !== personId);
      setTemporarySchedule(newShifts); // Actualizar estado temporal
    }
  };

  const saveTemporarySchedule = () => {
    setProgrammedSchedule(temporarySchedule); // Guardar cambios
    // Aquí, en un futuro, se haría la petición POST/PUT al backend
    console.log("Cambios guardados:", temporarySchedule);
  };

  const getValidPeopleForShift = (day, shiftType) => {
    const dayString = day.toISOString().split('T')[0];
    const weekDays = getWeekDays(selectedWeek, yearSet).map(d => d.toISOString().split('T')[0]);

    return people.filter(person => {
      const shiftsToday = temporarySchedule[dayString] || {}; // Usar estado temporal
      for (const sType in shiftsToday) {
        if (shiftsToday[sType].some(p => p.id === person.id)) return false;
      }
      
      const yesterday = new Date(day);
      yesterday.setDate(day.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      const shiftsYesterday = temporarySchedule[yesterdayString] || {}; // Usar estado temporal
      if (shiftsYesterday.night?.some(p => p.id === person.id)) {
        if (shiftType !== 'night' && shiftType !== 'off') return false;
      }

      let workShiftCount = 0;
      weekDays.forEach(weekDayString => {
        const dayShifts = temporarySchedule[weekDayString] || {}; // Usar estado temporal
        ['morning', 'afternoon', 'night'].forEach(workShiftType => {
          if (dayShifts[workShiftType]?.some(p => p.id === person.id)) workShiftCount++;
        });
      });

      if (workShiftCount >= 6 && shiftType !== 'off') return false;

      return true;
    });
  };

  const value = {
    yearSet,
    setYearSet,
    monthCalendario,
    setMonthCalendario,
    colombianHolidays,
    selectedWeek,
    setSelectedWeek,
    shifts: temporarySchedule, // El calendario ahora muestra los cambios temporales
    assignShift,
    removeShift,
    saveTemporarySchedule, // Nueva función para guardar
    getValidPeopleForShift,
    people,
    savePerson,
    deletePerson
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
