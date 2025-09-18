
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getPeople, savePerson as savePersonService, deletePerson as deletePersonService } from '../services/peopleService.js';
import { getProgramming, saveProgramming, getProgrammingStatus } from '../services/programmingService.js';
import { holidays as getColombianHolidays } from '../utils/holidays.js';
import { getWeekDays } from '../utils/getWeekDays.js';

export const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

// --- HELPERS ---
const hydrateSchedule = (schedule, people) => {
  if (!schedule || !people.length) return {};
  const peopleMap = new Map(people.map(p => [p.id, p]));
  const hydrated = {};
  for (const date in schedule) {
    hydrated[date] = {};
    for (const shiftType in schedule[date]) {
      hydrated[date][shiftType] = schedule[date][shiftType].map(personId => peopleMap.get(personId)).filter(Boolean);
    }
  }
  return hydrated;
};

const dehydrateSchedule = (schedule) => {
  const dehydrated = {};
  for (const date in schedule) {
    dehydrated[date] = {};
    for (const shiftType in schedule[date]) {
      dehydrated[date][shiftType] = schedule[date][shiftType].map(person => person.id);
    }
  }
  return dehydrated;
};

// --- PROVIDER ---
export const CalendarProvider = ({ children, addNotification }) => {
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]); // <-- CORRECCIÓN: Inicializado como array
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  
  const [scheduleCache, setScheduleCache] = useState(new Map());
  const [temporarySchedule, setTemporarySchedule] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // --- EFECTOS ---
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const data = await getPeople();
        const adaptedData = data.map(person => ({ ...person, id: person._id, name: `${person.nombre || ''} ${person.apellido || ''}`.trim() }));
        setPeople(adaptedData);
      } catch (error) {
        addNotification('Error al cargar los perfiles', 'error');
      }
    };
    fetchPeople();
  }, [addNotification]);

  useEffect(() => {
    const fetchHolidays = async () => {
      const holidays = await getColombianHolidays(yearSet);
      setColombianHolidays(holidays);
    };
    fetchHolidays();
  }, [yearSet]);

  useEffect(() => {
    if (people.length === 0) return;
    const month = monthCalendario + 1;
    const cacheKey = `${yearSet}-${month}`;
    
    if (scheduleCache.has(cacheKey)) {
      const cachedData = scheduleCache.get(cacheKey);
      const hydrated = hydrateSchedule(cachedData.schedule, people);
      setTemporarySchedule(hydrated);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    const revalidate = async () => {
      try {
        const serverStatus = await getProgrammingStatus(yearSet, month);
        const cachedData = scheduleCache.get(cacheKey);
        if (!cachedData || new Date(serverStatus.lastModified) > new Date(cachedData.lastModified)) {
          const serverData = await getProgramming(yearSet, month);
          setScheduleCache(prevCache => new Map(prevCache).set(cacheKey, serverData));
          const hydrated = hydrateSchedule(serverData.schedule, people);
          setTemporarySchedule(hydrated);
          addNotification('Programación actualizada desde el servidor.', 'info');
        }
      } catch (error) {
        addNotification('Error al sincronizar la programación', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    revalidate();
  }, [yearSet, monthCalendario, people, scheduleCache, addNotification]);

  // --- VALIDACIÓN DE TURNOS ---
  const isPersonValidForShift = (person, day, shiftType, schedule = temporarySchedule) => {
    const dayString = day.toISOString().split('T')[0];
    if (!selectedWeek) return true;
    const weekDays = getWeekDays(selectedWeek, yearSet).map(d => d.toISOString().split('T')[0]);
    const shiftsToday = schedule[dayString] || {};
    for (const sType in shiftsToday) {
      if (sType !== shiftType && shiftsToday[sType].some(p => p.id === person.id)) return false;
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

  // --- MANEJO DE CAMBIOS ---
  const assignShifts = (person, days, shiftType) => {
    setTemporarySchedule(currentSchedule => {
      const newSchedule = JSON.parse(JSON.stringify(currentSchedule));
      days.forEach(day => {
        if (isPersonValidForShift(person, day, shiftType, newSchedule)) {
          const dayString = day.toISOString().split('T')[0];
          if (!newSchedule[dayString]) newSchedule[dayString] = { morning: [], afternoon: [], night: [], off: [] };
          if (!newSchedule[dayString][shiftType].some(p => p.id === person.id)) {
            newSchedule[dayString][shiftType].push(person);
          }
        }
      });
      return newSchedule;
    });
    setIsDirty(true);
  };

  const assignShift = (day, shiftType, person) => assignShifts(person, [day], shiftType);

  const removeShift = (day, shiftType, personId) => {
    setTemporarySchedule(currentSchedule => {
      const newSchedule = JSON.parse(JSON.stringify(currentSchedule));
      const dayString = day.toISOString().split('T')[0];
      if (newSchedule[dayString] && newSchedule[dayString][shiftType]) {
        newSchedule[dayString][shiftType] = newSchedule[dayString][shiftType].filter(p => p.id !== personId);
      }
      return newSchedule;
    });
    setIsDirty(true);
  };

  const saveSchedule = async () => {
    const month = monthCalendario + 1;
    const dehydrated = dehydrateSchedule(temporarySchedule);
    setIsLoading(true);
    try {
      const savedData = await saveProgramming(yearSet, month, dehydrated);
      const cacheKey = `${yearSet}-${month}`;
      setScheduleCache(prevCache => new Map(prevCache).set(cacheKey, savedData));
      setIsDirty(false);
      addNotification('Programación guardada en el servidor', 'success');
    } catch (error) {
      addNotification('Error al guardar la programación', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- GESTIÓN DE PERSONAS ---
  const savePerson = async (personData, personIdForUpdate) => { /* ... */ };
  const deletePerson = async (personId) => { /* ... */ };

  // --- VALOR DEL CONTEXTO ---
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
    saveSchedule,
    isDirty,
    isLoading,
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
