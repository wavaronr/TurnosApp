import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useCalendar } from '../context/CalendarContext.js';
import '../css/Rutas.css';
import ExportIcon from '../icons/ExportIcon';

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
  // Obtenemos 'people' y 'shifts' del ÚNICO hook que existe: useCalendar
  const { yearSet, monthCalendario, setYearSet, setMonthCalendario, shifts, people } = useCalendar();
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
        if (!data || !people || people.length === 0) return [];

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
                    daySchedule[shift].forEach(personInSchedule => {
                        // Buscamos a la persona completa en el array 'people'
                        const fullPerson = people.find(p => p.id === personInSchedule.id);

                        // Y la usamos para la verificación
                        if (fullPerson && isRouteRequired(fullPerson, shift, scheduleDate)) {
                           rutasData.push({ CEDULA: fullPerson.identificacion, NOMBRE: fullPerson.name, FECHA: formattedDate, ORIGEN: origen, DESTINO: destino, HORA: hora });
                        }
                    });
                }
            };

            processShift('morning', 'CASA', 'REDEBAN', '06:00:00');
            processShift('afternoon', 'REDEBAN', 'CASA', '22:00:00');

            if (daySchedule.night) {
                daySchedule.night.forEach(personInSchedule => {
                    const fullPerson = people.find(p => p.id === personInSchedule.id);
                    
                    if (fullPerson && isRouteRequired(fullPerson, 'night', scheduleDate)) {
                        rutasData.push({ CEDULA: fullPerson.identificacion, NOMBRE: fullPerson.name, FECHA: formattedDate, ORIGEN: 'CASA', DESTINO: 'REDEBAN', HORA: '22:00:00' });
                        const nextDay = new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000);
                        const nextDayFormatted = nextDay.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
                        rutasData.push({ CEDULA: fullPerson.identificacion, NOMBRE: fullPerson.name, FECHA: nextDayFormatted, ORIGEN: 'REDEBAN', DESTINO: 'CASA', HORA: '06:00:00' });
                    }
                });
            }
        });
        return rutasData;
    };

    const processedRutas = processScheduleData(shifts, startDate, endDate);
    setRutas(processedRutas);
  }, [shifts, startDate, endDate, people]);

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
            <ExportIcon/>
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
