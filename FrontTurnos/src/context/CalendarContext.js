
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { holidays as getColombianHolidays } from '../utils/holidays.js';
import { getPeople, savePerson as savePersonService, deletePerson as deletePersonService } from '../services/peopleService.js';
// Importamos el nuevo servicio para el status
import { getProgramming, saveProgramming, getProgrammingStatus } from '../services/programmingService.js';

export const CalendarContext = createContext();

export const useCalendar = () => {
  return useContext(CalendarContext);
};

export const CalendarProvider = ({ children, addNotification }) => {
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]);
  const [people, setPeople] = useState([]);
  
  // El cache ahora almacena un objeto: { schedule, lastModified }
  const [schedulesCache, setSchedulesCache] = useState({});
  const [temporarySchedule, setTemporarySchedule] = useState({});
  
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null); // Estado que faltaba

  // --- LÓGICA DE DATOS PRINCIPAL ---

  // Función para revalidar la programación de un mes contra el servidor
  const revalidateProgramming = useCallback(async (year, month) => {
    const cacheKey = `${year}-${month + 1}`;
    const cachedData = schedulesCache[cacheKey];
    
    // Si no hay nada en cache para este mes, no hay nada que revalidar.
    if (!cachedData) return;

    try {
      const status = await getProgrammingStatus(year, month + 1);
      const serverLastModified = status.lastModified;
      const clientLastModified = cachedData.lastModified;

      // Comparamos las fechas. Si son diferentes, el cache está obsoleto.
      // La comparación de strings funciona bien para el formato ISO 8601.
      if (serverLastModified !== clientLastModified) {
        const newData = await getProgramming(year, month + 1);
        const newSchedule = newData ? newData.schedule : {};
        const newLastModified = newData ? newData.lastModified : null;
        
        setSchedulesCache(prev => ({ ...prev, [cacheKey]: { schedule: newSchedule, lastModified: newLastModified } }));
        
        // Solo actualizamos la vista si el mes revalidado es el que se está viendo
        if (year === yearSet && month === monthCalendario) {
          setTemporarySchedule(newSchedule);
          addNotification('La programación ha sido actualizada.', 'info');
        }
      }
    } catch (error) {
      addNotification(`No se pudo revalidar la programación: ${error.message}`, 'warning');
    }
  }, [schedulesCache, addNotification, yearSet, monthCalendario]);

  // Función para cargar la programación, ahora usando la estrategia "stale-while-revalidate"
  const loadProgramming = useCallback(async (year, month) => {
    const cacheKey = `${year}-${month + 1}`;
    setIsLoading(true);

    if (schedulesCache[cacheKey]) {
      // 1. Muestra datos del cache inmediatamente (stale)
      setTemporarySchedule(schedulesCache[cacheKey].schedule);
      setIsLoading(false);
      // 2. Revalida en segundo plano
      revalidateProgramming(year, month);
      return;
    }

    // Si no está en cache, carga desde la API
    try {
      const data = await getProgramming(year, month + 1);
      const schedule = data ? data.schedule : {};
      const lastModified = data ? data.lastModified : null;
      
      setSchedulesCache(prev => ({ ...prev, [cacheKey]: { schedule, lastModified } }));
      setTemporarySchedule(schedule);
    } catch (error) {
      addNotification(`Error al cargar la programación: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [schedulesCache, addNotification, revalidateProgramming]);

  // Función para guardar los cambios en la API
  const saveChangesToAPI = async () => {
    setIsLoading(true);
    try {
      const updatedProgramming = await saveProgramming(yearSet, monthCalendario + 1, temporarySchedule);
      const cacheKey = `${yearSet}-${monthCalendario + 1}`;
      
      // Actualizamos el cache con los datos frescos del servidor
      const newCacheEntry = {
        schedule: updatedProgramming.schedule,
        lastModified: updatedProgramming.lastModified
      };

      setSchedulesCache(prev => ({ ...prev, [cacheKey]: newCacheEntry }));
      setTemporarySchedule(updatedProgramming.schedule);
      setIsDirty(false);
      addNotification('Programación guardada exitosamente.', 'success');
    } catch (error) {
      addNotification(`Error al guardar: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- EFECTOS ---

  // Efecto para revalidar al enfocar la ventana/pestaña
  useEffect(() => {
    const handleFocus = () => {
      // Revalida el mes que se está viendo actualmente
      revalidateProgramming(yearSet, monthCalendario);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [revalidateProgramming, yearSet, monthCalendario]);

  // Efecto para cargar la programación cuando cambia el mes/año
  useEffect(() => {
    loadProgramming(yearSet, monthCalendario);
  }, [yearSet, monthCalendario, loadProgramming]);
  
  // Efectos para cargar personas y festivos (sin cambios)
  useEffect(() => {
    const fetchPeople = async () => { /* ...código sin cambios... */ };
    fetchPeople();
  }, [addNotification]);
  
  useEffect(() => {
    const fetchHolidays = async () => { /* ...código sin cambios... */ };
    fetchHolidays();
  }, [yearSet]);

  // --- MANEJO DE TURNOS (operan en temporarySchedule) ---

  const assignShifts = (person, days, shiftType) => {
    setTemporarySchedule(currentSchedule => {
        // ...lógica sin cambios...
        return newShifts;
    });
    setIsDirty(true);
  };
  
  const removeShift = (day, shiftType, personId) => {
    setTemporarySchedule(currentSchedule => {
        // ...lógica sin cambios...
        return newShifts;
    });
    setIsDirty(true);
  };

  // --- GESTIÓN DE PERSONAS (sin cambios) ---
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
    assignShifts,
    removeShift,
    saveTemporarySchedule: saveChangesToAPI,
    isDirty,
    isLoading,
    people,
    savePerson,
    deletePerson,
    isPersonValidForShift: () => true,
    getValidPeopleForShift: () => people,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
