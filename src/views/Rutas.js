import React, { useState, useEffect } from 'react';
import '../css/Rutas.css';

const Rutas = () => {
  const [rutas, setRutas] = useState([]);
  // Initialize state to September 2025 to match the data file
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    const processScheduleData = (data, month, year) => {
      const rutasData = [];
      if (!data || !data.days) {
        return [];
      }
      const scheduleDays = data.days;

      Object.keys(scheduleDays).forEach(dateKey => {
          const [y, m, d] = dateKey.split('-').map(Number);
          
          if (y === year && (m - 1) === month) {
              const daySchedule = scheduleDays[dateKey];
              
              const date = new Date(Date.UTC(y, m - 1, d));
              const formattedDate = date.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });

              const processShift = (shift, origen, destino, hora) => {
                  if (daySchedule[shift]) {
                      daySchedule[shift].forEach(person => {
                          rutasData.push({
                              CEDULA: person.id,
                              NOMBRE: person.name,
                              FECHA: formattedDate,
                              ORIGEN: origen,
                              DESTINO: destino,
                              HORA: hora,
                          });
                      });
                  }
              };

              processShift('morning', 'CASA', 'REDEBAN', '06:00:00');
              processShift('afternoon', 'REDEBAN', 'CASA', '22:00:00');

              if (daySchedule.night) {
                  daySchedule.night.forEach(person => {
                      rutasData.push({
                          CEDULA: person.id,
                          NOMBRE: person.name,
                          FECHA: formattedDate,
                          ORIGEN: 'CASA',
                          DESTINO: 'REDEBAN',
                          HORA: '22:00:00',
                      });
                      
                      const nextDay = new Date(Date.UTC(y, m - 1, d + 1));
                      const nextDayFormatted = nextDay.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
                      rutasData.push({
                          CEDULA: person.id,
                          NOMBRE: person.name,
                          FECHA: nextDayFormatted,
                          ORIGEN: 'REDEBAN',
                          DESTINO: 'CASA',
                          HORA: '06:00:00',
                      });
                  });
              }
          }
      });
      return rutasData;
    };

    try {
      const scheduleData = require('../data/september-2025-schedule.json');
      const processedRutas = processScheduleData(scheduleData, currentMonth, currentYear);
      setRutas(processedRutas);
    } catch(error) {
        console.error("Error processing schedule data:", error);
        setRutas([]);
    }
  }, [currentMonth, currentYear]);

  const handleMonthChange = (increment) => {
    setCurrentMonth(prevMonth => {
      let newMonth = prevMonth + increment;
      let newYear = currentYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  return (
    <div className="rutas-container">
      <h2>Gestión de Rutas</h2>
      <div className="month-navigator">
        <button onClick={() => handleMonthChange(-1)}>&lt; Anterior</button>
        <span>{new Date(currentYear, currentMonth).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => handleMonthChange(1)}>Siguiente &gt;</button>
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
