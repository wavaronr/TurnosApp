import React, { useState, useEffect } from 'react';
import '../css/Rutas.css';

// Helper to get the first and last day of a month
const getMonthDateRange = (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
    };
};

const Rutas = () => {
  const [rutas, setRutas] = useState([]);
  // State is now driven by startDate and endDate
  const [startDate, setStartDate] = useState(getMonthDateRange(2025, 8).start);
  const [endDate, setEndDate] = useState(getMonthDateRange(2025, 8).end);
  const [displayMonth, setDisplayMonth] = useState(new Date(2025, 8));

  useEffect(() => {
    const processScheduleData = (data, start, end) => {
      const rutasData = [];
      if (!data || !data.days) {
        return [];
      }

      const startDateObj = start ? new Date(start + 'T00:00:00Z') : null;
      const endDateObj = end ? new Date(end + 'T23:59:59Z') : null;

      Object.keys(data.days).forEach(dateKey => {
        const scheduleDate = new Date(dateKey + 'T00:00:00Z');
        
        // Primary filtering logic based on the date range
        if (startDateObj && scheduleDate < startDateObj) {
          return;
        }
        if (endDateObj && scheduleDate > endDateObj) {
          return;
        }

        const daySchedule = data.days[dateKey];
        const formattedDate = scheduleDate.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });

        const processShift = (shift, origen, destino, hora) => {
          if (daySchedule[shift]) {
            daySchedule[shift].forEach(person => {
              rutasData.push({ CEDULA: person.id, NOMBRE: person.name, FECHA: formattedDate, ORIGEN: origen, DESTINO: destino, HORA: hora });
            });
          }
        };

        processShift('morning', 'CASA', 'REDEBAN', '06:00:00');
        processShift('afternoon', 'REDEBAN', 'CASA', '22:00:00');

        if (daySchedule.night) {
          daySchedule.night.forEach(person => {
            rutasData.push({ CEDULA: person.id, NOMBRE: person.name, FECHA: formattedDate, ORIGEN: 'CASA', DESTINO: 'REDEBAN', HORA: '22:00:00' });
            
            const nextDay = new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000);
            const nextDayFormatted = nextDay.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
            rutasData.push({ CEDULA: person.id, NOMBRE: person.name, FECHA: nextDayFormatted, ORIGEN: 'REDEBAN', DESTINO: 'CASA', HORA: '06:00:00' });
          });
        }
      });
      return rutasData;
    };

    try {
      const scheduleData = require('../data/september-2025-schedule.json');
      const processedRutas = processScheduleData(scheduleData, startDate, endDate);
      setRutas(processedRutas);
    } catch(error) {
      console.error("Error processing schedule data:", error);
      setRutas([]);
    }
  }, [startDate, endDate]); // Effect is driven by date range

  const handleMonthChange = (increment) => {
    setDisplayMonth(prevDate => {
        const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + increment, 1);
        const { start, end } = getMonthDateRange(newDate.getFullYear(), newDate.getMonth());
        setStartDate(start);
        setEndDate(end);
        return newDate;
    });
  };

  return (
    <div className="rutas-container">
      <h2>Gestión de Rutas</h2>
      <div className="filters-container">
        <div className="month-navigator">
          <button onClick={() => handleMonthChange(-1)}>&lt; Anterior</button>
          <span>{displayMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => handleMonthChange(1)}>Siguiente &gt;</button>
        </div>
        <div className="date-filters">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>
      <div className="table-responsive">
        <table className="rutas-table">
          <thead>
            <tr>
              <th>CÉDULA</th>
              <th>FECHA</th>
              <th>NOMBRE</th>
              <th>ORIGEN</th>
              <th>DESTINO</th>
              <th>HORA</th>
            </tr>
          </thead>
          <tbody>
            {rutas.map((ruta, index) => (
              <tr key={index}>
                <td>{ruta.CEDULA}</td>
                <td>{ruta.FECHA}</td>
                <td>{ruta.NOMBRE}</td>
                <td>{ruta.ORIGEN}</td>
                <td>{ruta.DESTINO}</td>
                <td>{ruta.HORA}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rutas;
