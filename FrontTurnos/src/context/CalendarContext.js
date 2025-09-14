import React, { createContext, useState, useEffect, useContext } from 'react';
import { holidays as getColombianHolidays } from '../utils/holidays.js';
import { getWeekDays } from '../utils/getWeekDays.js';

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
        setPeople([]);
      });

    setProgrammedSchedule({});
    setTemporarySchedule({});
    setIsDirty(false);
  }, []);

  const savePerson = async (personData) => {
    if (personData.id && people.some(p => p.id === personData.id)) {
      // Lógica para ACTUALIZAR (PUT)
      // TODO: Implementar la lógica para ACTUALIZAR una persona en el backend (PUT request)
      console.log("Actualizando persona (simulado):", personData);
      // Simulación de actualización en el frontend
      setPeople(people.map(p => (p.id === personData.id ? { ...p, ...personData } : p)));
      alert('Perfil actualizado exitosamente (simulado)');

    } else {
      // Lógica para CREAR (POST)
      try {
        // 1. Transformar los datos del formulario al formato del backend
        const payload = {
          name: `${personData.nombre} ${personData.apellido}`.trim(),
          id: personData.id,
          email: personData.email,
          cargo: personData.cargo,
          telefono: personData.telefono,
        };

        const response = await fetch('/api/personas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), // 2. Enviar el payload transformado
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al crear la persona');
        }

        const savedPersonResponse = await response.json();
        const savedPerson = savedPersonResponse.persona; // Acceder al objeto anidado

        // Adaptar la respuesta del backend al formato del estado del frontend
        const adaptedPerson = {
          ...savedPerson,
          id: savedPerson._id,
          name: `${savedPerson.nombre} ${savedPerson.apellido}`.trim(),
        };

        setPeople(prevPeople => [...prevPeople, adaptedPerson]);
        alert('¡Persona creada exitosamente!');

      } catch (error) {
        console.error('Error saving person:', error);
        alert(`Error al crear la persona: ${error.message}`);
      }
    }
  };


  const deletePerson = (personId) => {
    // TODO: Añadir lógica de eliminación en el backend
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
    deletePerson
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};