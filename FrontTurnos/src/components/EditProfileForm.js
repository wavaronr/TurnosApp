import React, { useState, useEffect } from 'react';
import '../css/EditProfileForm.css';
import { capitalize } from '../utils/textUtils.js'; // Importar desde el archivo de utilidades

function EditProfileForm({ person, onSubmit, onClose }) {
  const isEditMode = Boolean(person);

  const getInitialState = () => {
    if (isEditMode) {
      return {
        identificacion: person.identificacion || '',
        nombre: person.nombre || '',
        apellido: person.apellido || '',
        email: person.email || '',
        telefono: person.telefono || '',
        cargo: person.cargo || ''
      };
    }
    return {
      identificacion: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      cargo: ''
    };
  };

  const [formData, setFormData] = useState(getInitialState);

  useEffect(() => {
    setFormData(getInitialState());
  }, [person, isEditMode]);

  function handleChange(e) {
    const { name, value } = e.target;

    // Aplica la capitalización a los campos deseados
    let finalValue = value;
    if (name === 'nombre' || name === 'apellido' || name === 'cargo') {
      finalValue = capitalize(value);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditMode ? 'Editar Perfil' : 'Crear Perfil'}</h2>
        <form onSubmit={handleSubmit}>

          {!isEditMode && (
            <div className="form-group">
              <label htmlFor="identificacion">Identificación</label>
              <input
                type="text"
                id="identificacion"
                name="identificacion"
                value={formData.identificacion}
                onChange={handleChange}
                placeholder="Ej: 123456789"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ej: Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: juan.perez@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 1122334455"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cargo">Cargo</label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              placeholder="Ej: Técnico de Soporte"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-update">
              {isEditMode ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;
