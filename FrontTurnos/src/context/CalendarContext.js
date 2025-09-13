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
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setPeople(peopleData);
    const initialData = JSON.parse(JSON.stringify(initialSchedule.days));
    setProgrammedSchedule(initialData);
    setTemporarySchedule(initialData);
    setIsDirty(false);
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

  const assignShifts = (person, days, shiftType) => {
    setTemporarySchedule(currentSchedule => {
      const newShifts = JSON.parse(JSON.stringify(currentSchedule));
      days.forEach(day => {
        // La validación se hace aquí, contra la copia que se va modificando
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
    console.log("Cambios guardados:", temporarySchedule);
  };

  const isPersonValidForShift = (person, day, shiftType, schedule = temporarySchedule) => {
    const dayString = day.toISOString().split('T')[0];
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
    assignShift, // Se mantiene por si se necesita en otro lado
    assignShifts, // La nueva función robusta
    removeShift,
    saveTemporarySchedule,
    isDirty,
    getValidPeopleForShift,
    isPersonValidForShift,
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