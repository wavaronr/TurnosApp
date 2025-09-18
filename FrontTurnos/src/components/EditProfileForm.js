import React, { useState, useEffect } from 'react';
import '../css/EditProfileForm.css';
import { capitalize } from '../utils/textUtils.js';

const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function EditProfileForm({ person, onSubmit, onClose }) {
  const isEditMode = Boolean(person);

  const getInitialState = () => {
    const baseState = {
      identificacion: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      cargo: ''
    };

    const routeConfigDefault = {
        morning: { required: false, type: 'all', days: [] },
        afternoon: { required: false, type: 'all', days: [] },
        night: { required: false, type: 'all', days: [] },
    };

    if (isEditMode && person) {
      const personRouteConfig = person.routeConfig || {};
      return {
        _id: person._id, // <-- AÑADIDO: Preservar el _id
        identificacion: person.identificacion || '',
        nombre: person.nombre || '',
        apellido: person.apellido || '',
        email: person.email || '',
        telefono: person.telefono || '',
        cargo: person.cargo || '',
        routeConfig: {
            morning: { ...routeConfigDefault.morning, ...personRouteConfig.morning },
            afternoon: { ...routeConfigDefault.afternoon, ...personRouteConfig.afternoon },
            night: { ...routeConfigDefault.night, ...personRouteConfig.night },
        }
      };
    }
    return { ...baseState, routeConfig: routeConfigDefault };
  };

  const [formData, setFormData] = useState(getInitialState);

  useEffect(() => {
    setFormData(getInitialState());
  }, [person, isEditMode]);

  function handleChange(e) {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'nombre' || name === 'apellido' || name === 'cargo') {
      finalValue = capitalize(value);
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  }

    function handleRouteChange(shift, field, value) {
        setFormData(prev => {
            const newRouteConfig = JSON.parse(JSON.stringify(prev.routeConfig)); // Deep copy

            if (field === 'required') {
                newRouteConfig[shift].required = value;
            } else if (field === 'type') {
                newRouteConfig[shift].type = value;
            } else if (field === 'day') {
                const currentDays = newRouteConfig[shift].days;
                const dayName = value.startsWith('-') ? value.substring(1) : value;
                const isRemoving = currentDays.includes(dayName);

                if (isRemoving) {
                    newRouteConfig[shift].days = currentDays.filter(day => day !== dayName);
                } else {
                    newRouteConfig[shift].days.push(dayName);
                }
            }
            return { ...prev, routeConfig: newRouteConfig };
        });
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h2>{isEditMode ? 'Editar Perfil' : 'Crear Perfil'}</h2>
          
          <div className="form-scrollable-area">
            {!isEditMode && (
              <div className="form-group">
                <label htmlFor="identificacion">Identificación</label>
                <input type="text" id="identificacion" name="identificacion" value={formData.identificacion} onChange={handleChange} required />
              </div>
            )}
            
            <div className="form-group"><label>Nombre</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></div>
            <div className="form-group"><label>Apellido</label><input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required /></div>
            <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
            <div className="form-group"><label>Teléfono</label><input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} /></div>
            <div className="form-group"><label>Cargo</label><input type="text" name="cargo" value={formData.cargo} onChange={handleChange} /></div>
            
            <div className="route-config-section">
                <h3>Configuración de Rutas</h3>
                {['morning', 'afternoon', 'night'].map(shift => {
                    const shiftTitle = { morning: 'Mañana', afternoon: 'Tarde', night: 'Noche' }[shift];
                    const config = formData.routeConfig[shift];

                    return (
                        <div key={shift} className="route-shift-config">
                            <div className="route-shift-header" onClick={() => handleRouteChange(shift, 'required', !config.required)}>
                                <div className="toggle-switch">
                                    <input type="checkbox" id={`${shift}-required`} checked={config.required} readOnly />
                                    <span className="toggle-slider"></span>
                                </div>
                                <label htmlFor={`${shift}-required`}>Ruta {shiftTitle}</label>
                            </div>

                            {config.required && (
                                <div className="route-options">
                                    <div className="radio-group-container">
                                        <label className="custom-radio">
                                            <input type="radio" name={`${shift}-type`} value="all" checked={config.type === 'all'} onChange={() => handleRouteChange(shift, 'type', 'all')} />
                                            <span className="radio-dot"></span>
                                            <span>Todos los días</span>
                                        </label>
                                        <label className="custom-radio">
                                            <input type="radio" name={`${shift}-type`} value="specific" checked={config.type === 'specific'} onChange={() => handleRouteChange(shift, 'type', 'specific')} />
                                            <span className="radio-dot"></span>
                                            <span>Elegir días</span>
                                        </label>
                                    </div>

                                    {config.type === 'specific' && (
                                        <div className="days-selection-container">
                                            {weekDays.map(day => {
                                                const isChecked = config.days.includes(day);
                                                return (
                                                    <label key={day} className={`day-checkbox ${isChecked ? 'checked' : ''}`}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isChecked}
                                                            onChange={() => handleRouteChange(shift, 'day', day)} 
                                                        />
                                                        {day.substring(0, 3)}
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

          </div>

          <div className="form-actions">
            <button type="submit" className="btn-update">{isEditMode ? 'Actualizar' : 'Crear'}</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;
