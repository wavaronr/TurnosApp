import React, { useState, useEffect, useMemo } from 'react';
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
  const { yearSet, monthCalendario, setYearSet, setMonthCalendario, shifts, people } = useCalendar();
  const [rutas, setRutas] = useState([]);
  const [startDate, setStartDate] = useState(getMonthDateRange(yearSet, monthCalendario).start);
  const [endDate, setEndDate] = useState(getMonthDateRange(yearSet, monthCalendario).end);
  
  // 1. Estado para manejar los valores de los filtros
  const [filters, setFilters] = useState({
    CEDULA: '',
    FECHA: '',
    NOMBRE: '',
    ORIGEN: '',
    DESTINO: '',
    HORA: ''
  });

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
                        const fullPerson = people.find(p => p.id === personInSchedule.id);
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

  // 2. Lógica para filtrar las rutas usando useMemo para eficiencia
  const filteredRutas = useMemo(() => {
    return rutas.filter(ruta => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key].toLowerCase();
        const rutaValue = String(ruta[key]).toLowerCase();
        return rutaValue.includes(filterValue);
      });
    });
  }, [rutas, filters]);

  // 3. Manejador para actualizar el estado de los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleMonthChange = (increment) => {
    const newMonth = increment < 0 ? (monthCalendario === 0 ? 11 : monthCalendario - 1) : (monthCalendario === 11 ? 0 : monthCalendario + 1);
    const newYear = increment < 0 && newMonth === 11 ? yearSet - 1 : (increment > 0 && newMonth === 0 ? yearSet + 1 : yearSet);
    setMonthCalendario(newMonth);
    setYearSet(newYear);
  };

  const handleExport = () => {
    // Se exportan las rutas ya filtradas
    const worksheet = XLSX.utils.json_to_sheet(filteredRutas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rutas Filtradas");
    XLSX.writeFile(workbook, "rutas_filtradas.xlsx");
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
            {/* 4. Fila con los inputs para filtrar */}
            <tr className="filter-row">
              <td><input type="text" name="CEDULA" value={filters.CEDULA} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td><input type="text" name="FECHA" value={filters.FECHA} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td><input type="text" name="NOMBRE" value={filters.NOMBRE} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td><input type="text" name="ORIGEN" value={filters.ORIGEN} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td><input type="text" name="DESTINO" value={filters.DESTINO} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td><input type="text" name="HORA" value={filters.HORA} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
            </tr>
          </thead>
          <tbody>
            {/* 5. Se mapean las rutas ya filtradas */}
            {filteredRutas.length > 0 ? (
              filteredRutas.map((ruta, index) => (
                <tr key={index}>
                  <td>{ruta.CEDULA}</td>
                  <td>{ruta.FECHA}</td>
                  <td>{ruta.NOMBRE}</td>
                  <td>{ruta.ORIGEN}</td>
                  <td>{ruta.DESTINO}</td>
                  <td>{ruta.HORA}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No se encontraron rutas con los filtros aplicados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rutas;
