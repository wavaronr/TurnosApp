import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useCalendar } from '../context/CalendarContext.js';
import '../css/Rutas.css';

const weekDayMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getMonthDateRange = (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
    };
};

const isRouteRequired = (person, shift, date) => {
    if (!person.routeConfig || !person.routeConfig[shift] || !person.routeConfig[shift].required) {
        return false;
    }

    const config = person.routeConfig[shift];
    if (config.type === 'all') {
        return true;
    }

    if (config.type === 'specific') {
        const dayOfWeek = weekDayMap[date.getUTCDay()];
        return config.days.includes(dayOfWeek);
    }

    return false;
};

const Rutas = () => {
  const { yearSet, monthCalendario, setYearSet, setMonthCalendario, shifts } = useCalendar();
  const [rutas, setRutas] = useState([]);
  const [startDate, setStartDate] = useState(getMonthDateRange(yearSet, monthCalendario).start);
  const [endDate, setEndDate] = useState(getMonthDateRange(yearSet, monthCalendario).end);

  useEffect(() => {
    const range = getMonthDateRange(yearSet, monthCalendario);
    setStartDate(range.start);
    setEndDate(range.end);
  }, [yearSet, monthCalendario]);

  useEffect(() => {
    const processScheduleData = (data, start, end) => {
        const rutasData = [];
        if (!data) return [];

        const startDateObj = start ? new Date(start + 'T00:00:00Z') : null;
        const endDateObj = end ? new Date(end + 'T23:59:59Z') : null;

        Object.keys(data).forEach(dateKey => {
            const scheduleDate = new Date(dateKey + 'T00:00:00Z');

            if ((startDateObj && scheduleDate < startDateObj) || (endDateObj && scheduleDate > endDateObj)) {
                return;
            }

            const daySchedule = data[dateKey];
            const formattedDate = scheduleDate.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });

            const processShift = (shift, origen, destino, hora) => {
                if (daySchedule[shift]) {
                    daySchedule[shift].forEach(person => {
                        if (isRouteRequired(person, shift, scheduleDate)) {
                           rutasData.push({ CEDULA: person.identificacion, NOMBRE: person.name, FECHA: formattedDate, ORIGEN: origen, DESTINO: destino, HORA: hora });
                        }
                    });
                }
            };

            processShift('morning', 'CASA', 'REDEBAN', '06:00:00');
            processShift('afternoon', 'REDEBAN', 'CASA', '22:00:00');

            if (daySchedule.night) {
                daySchedule.night.forEach(person => {
                    if (isRouteRequired(person, 'night', scheduleDate)) {
                        rutasData.push({ CEDULA: person.identificacion, NOMBRE: person.name, FECHA: formattedDate, ORIGEN: 'CASA', DESTINO: 'REDEBAN', HORA: '22:00:00' });
                        const nextDay = new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000);
                        const nextDayFormatted = nextDay.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
                        rutasData.push({ CEDULA: person.identificacion, NOMBRE: person.name, FECHA: nextDayFormatted, ORIGEN: 'REDEBAN', DESTINO: 'CASA', HORA: '06:00:00' });
                    }
                });
            }
        });
        return rutasData;
    };

    const processedRutas = processScheduleData(shifts, startDate, endDate);
    setRutas(processedRutas);
  }, [shifts, startDate, endDate]);

  const handleMonthChange = (increment) => {
    if (increment < 0) {
        if (monthCalendario === 0) {
            setMonthCalendario(11);
            setYearSet(yearSet - 1);
        } else {
            setMonthCalendario(monthCalendario - 1);
        }
    } else {
        if (monthCalendario === 11) {
            setMonthCalendario(0);
            setYearSet(yearSet + 1);
        } else {
            setMonthCalendario(monthCalendario + 1);
        }
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(rutas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rutas");
    XLSX.writeFile(workbook, "rutas.xlsx");
  };

  const displayDate = new Date(yearSet, monthCalendario);

  return (
    <div className="rutas-container">
      <h2>Gestión de Rutas</h2>
      <div className="filters-container">
        <div className="month-navigator">
          <button onClick={() => handleMonthChange(-1)}>&lt; Anterior</button>
          <span>{displayDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => handleMonthChange(1)}>Siguiente &gt;</button>
        </div>
        <div className="date-filters">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <button onClick={handleExport} className="export-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
            Exportar
          </button>
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
