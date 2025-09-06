import React, { createContext, useState, useEffect, useContext } from 'react';
import { holidays as getColombianHolidays } from '../utils/holidays.js';
import { getWeekDays } from '../utils/getWeekDays.js';
// Corregir la importación de JSON usando la palabra clave 'with' en lugar de 'assert'
import peopleData from '../data/dataPerson.json' with { type: 'json' }; 

// El resto del archivo permanece exactamente igual

// Crear el Contexto
export const CalendarContext = createContext();

// Hook personalizado
export const useCalendar = () => {
  return useContext(CalendarContext);
};

// Proveedor del Contexto
export const CalendarProvider = ({ children }) => {
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  // Añadir el estado monthCalendario
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [shifts, setShifts] = useState({});
  const [people, setPeople] = useState([]);

  useEffect(() => {
    // 'peopleData' se cargará correctamente con la nueva sintaxis
    setPeople(peopleData);
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
    const newShifts = JSON.parse(JSON.stringify(shifts));
    if (!newShifts[dayString]) {
      newShifts[dayString] = { morning: [], afternoon: [], night: [], off: [] };
    }
    newShifts[dayString][shiftType].push(person);
    setShifts(newShifts);
  };

  const removeShift = (day, shiftType, personId) => {
    const dayString = day.toISOString().split('T')[0];
    const newShifts = JSON.parse(JSON.stringify(shifts));
    if (newShifts[dayString] && newShifts[dayString][shiftType]) {
      newShifts[dayString][shiftType] = newShifts[dayString][shiftType].filter(p => p.id !== personId);
      setShifts(newShifts);
    }
  };

  const getValidPeopleForShift = (day, shiftType) => {
    const dayString = day.toISOString().split('T')[0];
    const weekDays = getWeekDays(selectedWeek, yearSet).map(d => d.toISOString().split('T')[0]);

    return people.filter(person => {
      const shiftsToday = shifts[dayString] || {};
      for (const sType in shiftsToday) {
        if (shiftsToday[sType].some(p => p.id === person.id)) return false;
      }
      
      const yesterday = new Date(day);
      yesterday.setDate(day.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      const shiftsYesterday = shifts[yesterdayString] || {};
      if (shiftsYesterday.night?.some(p => p.id === person.id)) {
        if (shiftType !== 'night' && shiftType !== 'off') return false;
      }

      let workShiftCount = 0;
      weekDays.forEach(weekDayString => {
        const dayShifts = shifts[weekDayString] || {};
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
    // Exponer el estado monthCalendario
    monthCalendario,
    setMonthCalendario,
    colombianHolidays,
    selectedWeek,
    setSelectedWeek,
    shifts,
    assignShift,
    removeShift,
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
