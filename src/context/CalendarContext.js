import React, { createContext, useState, useEffect, useContext } from 'react';
import { holidays as getColombianHolidays } from '../utils/holidays.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import peopleData from '../data/dataPerson.json' with { type: 'json' };
import initialSchedule from '../data/september-2025-schedule.json' with { type: 'json' };

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

  const [programmedSchedule, setProgrammedSchedule] = useState({});
  const [temporarySchedule, setTemporarySchedule] = useState({});
  const [isDirty, setIsDirty] = useState(false); // <-- 1. Añadir bandera de estado

  useEffect(() => {
    setPeople(peopleData);
    const initialData = JSON.parse(JSON.stringify(initialSchedule.days));
    setProgrammedSchedule(initialData);
    setTemporarySchedule(initialData);
    setIsDirty(false); // Asegurarse de que esté limpio al inicio
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
    const newShifts = JSON.parse(JSON.stringify(temporarySchedule));
    if (!newShifts[dayString]) {
      newShifts[dayString] = { morning: [], afternoon: [], night: [], off: [] };
    }
    newShifts[dayString][shiftType].push(person);
    setTemporarySchedule(newShifts);
    setIsDirty(true); // <-- 2. Marcar como "sucio" al añadir
  };

  const removeShift = (day, shiftType, personId) => {
    const dayString = day.toISOString().split('T')[0];
    const newShifts = JSON.parse(JSON.stringify(temporarySchedule));
    if (newShifts[dayString] && newShifts[dayString][shiftType]) {
      newShifts[dayString][shiftType] = newShifts[dayString][shiftType].filter(p => p.id !== personId);
      setTemporarySchedule(newShifts);
      setIsDirty(true); // <-- 2. Marcar como "sucio" al quitar
    }
  };

  const saveTemporarySchedule = () => {
    setProgrammedSchedule(temporarySchedule);
    setIsDirty(false); // <-- 3. Marcar como "limpio" al guardar
    console.log("Cambios guardados:", temporarySchedule);
  };

  const getValidPeopleForShift = (day, shiftType) => {
    const dayString = day.toISOString().split('T')[0];
    const weekDays = getWeekDays(selectedWeek, yearSet).map(d => d.toISOString().split('T')[0]);

    return people.filter(person => {
      const shiftsToday = temporarySchedule[dayString] || {};
      for (const sType in shiftsToday) {
        if (shiftsToday[sType].some(p => p.id === person.id)) return false;
      }
      
      const yesterday = new Date(day);
      yesterday.setDate(day.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      const shiftsYesterday = temporarySchedule[yesterdayString] || {};
      if (shiftsYesterday.night?.some(p => p.id === person.id)) {
        if (shiftType !== 'night' && shiftType !== 'off') return false;
      }

      let workShiftCount = 0;
      weekDays.forEach(weekDayString => {
        const dayShifts = temporarySchedule[weekDayString] || {};
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
    shifts: temporarySchedule,
    assignShift,
    removeShift,
    saveTemporarySchedule,
    isDirty, // <-- 4. Exponer la bandera
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
