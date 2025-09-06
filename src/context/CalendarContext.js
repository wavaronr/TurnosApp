import React, { createContext, useState, useEffect, useContext } from 'react';
import { holidays } from '../components/holidays.js';

// 1. Crear el Contexto
const CalendarContext = createContext();

// Hook personalizado para consumir el contexto más fácilmente
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar debe ser usado dentro de un CalendarProvider');
  }
  return context;
};

// 2. Crear el Proveedor del Contexto
export const CalendarProvider = ({ children }) => {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]);

  // Efecto para cargar los festivos cuando el año cambia
  useEffect(() => {
    const fetchHolidays = async () => {
      const holidaysData = await holidays(yearSet);
      setColombianHolidays(holidaysData);
    };
    fetchHolidays();
  }, [yearSet]);

  // 3. El valor que será accesible por los componentes hijos
  const value = {
    selectedWeek,
    setSelectedWeek,
    yearSet,
    setYearSet,
    monthCalendario,
    setMonthCalendario,
    colombianHolidays,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
