import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
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
 // console.log(people)
  
  const [filters, setFilters] = useState({
    CEDULA: '',
    FECHA: '',
    NOMBRE: '',
    ORIGEN: '',
    DESTINO: '',
    HORA: '',
    CORREO: ''
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
                           rutasData.push({ CEDULA: fullPerson.identificacion, NOMBRE: fullPerson.name, FECHA: formattedDate, ORIGEN: origen, DESTINO: destino, HORA: hora, CORREO: fullPerson.email });
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
                        rutasData.push({ CEDULA: fullPerson.identificacion, NOMBRE: fullPerson.name, FECHA: formattedDate, ORIGEN: 'CASA', DESTINO: 'REDEBAN', HORA: '22:00:00', CORREO: fullPerson.email });
                        const nextDay = new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000);
                        const nextDayFormatted = nextDay.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
                        rutasData.push({ CEDULA: fullPerson.identificacion, NOMBRE: fullPerson.name, FECHA: nextDayFormatted, ORIGEN: 'REDEBAN', DESTINO: 'CASA', HORA: '06:00:00', CORREO: fullPerson.email });
                    }
                });
            }
        });
        return rutasData;
    };
    const processedRutas = processScheduleData(shifts, startDate, endDate);
    setRutas(processedRutas);
  }, [shifts, startDate, endDate, people]);

  const filteredRutas = useMemo(() => {
    return rutas.filter(ruta => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key].toLowerCase();
        const rutaValue = String(ruta[key]).toLowerCase();
        return rutaValue.includes(filterValue);
      });
    });
  }, [rutas, filters]);
//  console.log(filteredRutas)

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
    if (filteredRutas.length === 0) {
      console.log("No hay datos para exportar.");
      return; 
    }
    const csv = Papa.unparse(filteredRutas);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'rutas_filtradas.csv');
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
      {/* Tabla tradicional en escritorio */}
      <div className="table-responsive">
        <table className="rutas-table">
          <thead>
            <tr>
              <th>CÉDULA</th>
              <th>FECHA</th>
              <th>NOMBRE</th>
              <th className="hide-mobile">ORIGEN</th>
              <th className="hide-mobile">DESTINO</th>
              <th className="hide-mobile">HORA</th>
            </tr>
            <tr className="filter-row">
              <td><input type="text" name="CEDULA" value={filters.CEDULA} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td><input type="text" name="FECHA" value={filters.FECHA} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td><input type="text" name="NOMBRE" value={filters.NOMBRE} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td className="hide-mobile"><input type="text" name="ORIGEN" value={filters.ORIGEN} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td className="hide-mobile"><input type="text" name="DESTINO" value={filters.DESTINO} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
              <td className="hide-mobile"><input type="text" name="HORA" value={filters.HORA} onChange={handleFilterChange} placeholder="Filtrar..." /></td>
            </tr>
          </thead>
          <tbody>
            {filteredRutas.length > 0 ? (
              filteredRutas.map((ruta, index) => (
                <tr key={index}>
                  <td data-label="CÉDULA">{ruta.CEDULA}</td>
                  <td data-label="FECHA">{ruta.FECHA}</td>
                  <td data-label="NOMBRE">{ruta.NOMBRE}</td>
                  <td data-label="ORIGEN" className="hide-mobile">{ruta.ORIGEN}</td>
                  <td data-label="DESTINO" className="hide-mobile">{ruta.DESTINO}</td>
                  <td data-label="HORA" className="hide-mobile">{ruta.HORA}</td>
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
      {/* Card-table híbrida en móvil: UNA card por persona */}
      <div className="rutas-cards-mobile">
        {filteredRutas.length > 0 ? (
          <>
            {Object.entries(
              filteredRutas.reduce((acc, ruta) => {
                if (!acc[ruta.CEDULA]) acc[ruta.CEDULA] = { nombre: ruta.NOMBRE, fechas: [] };
                acc[ruta.CEDULA].fechas.push({ ...ruta });
                return acc;
              }, {})
            ).map(([cedula, { nombre, fechas }]) => (
              <CardPersonaRutasMobile key={cedula} cedula={cedula} nombre={nombre} fechas={fechas} />
            ))}
          </>
        ) : (
          <div className="ruta-card-h empty">No se encontraron rutas con los filtros aplicados.</div>
        )}
      </div>
    </div>
  );
}


// --- Card-table híbrida para móvil: UNA card por persona ---
function CardPersonaRutasMobile({ cedula, nombre, fechas }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  return (
    <div className="ruta-card-h">
      <div className="ruta-card-h-header" onClick={() => setOpen(o => !o)} style={{cursor:'pointer'}}>
        <div>
          <div className="ruta-card-h-title">{nombre}</div>
          <div className="ruta-card-h-date">Cédula: {cedula}</div>
        </div>
        <button className="ruta-card-h-expand" aria-label={open ? 'Ocultar fechas' : 'Ver fechas'} tabIndex={-1}>
          {open ? '−' : '+'}
        </button>
      </div>
      {open && (
        <div className="ruta-card-h-fechas-list">
          {fechas.map((f, idx) => (
            <div key={f.FECHA + f.HORA + idx} className="ruta-card-h-fecha-row">
              <button
                className={`ruta-card-h-fecha-btn${selected === idx ? ' selected' : ''}`}
                onClick={() => setSelected(selected === idx ? null : idx)}
              >
                {f.FECHA}
              </button>
              {selected === idx && (
                <div className="ruta-card-h-details open">
                  <div className="ruta-card-h-detail-row"><span className="ruta-card-h-detail-label">Origen:</span> {f.ORIGEN}</div>
                  <div className="ruta-card-h-detail-row"><span className="ruta-card-h-detail-label">Destino:</span> {f.DESTINO}</div>
                  <div className="ruta-card-h-detail-row"><span className="ruta-card-h-detail-label">Hora:</span> {f.HORA}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rutas;
