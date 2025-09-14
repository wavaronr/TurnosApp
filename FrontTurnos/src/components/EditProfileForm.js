
import React, { useState, useEffect } from 'react';
import '../css/EditProfileForm.css';

function EditProfileForm({ person, onSubmit, onClose }) {
  const isEditMode = Boolean(person);
  
  // Estado inicial que coincide con el modelo del backend
  const getInitialState = () => {
    if (isEditMode) {
      // En modo edición, no permitimos cambiar la identificación
      return {
        id: person.id || '', 
        nombre: person.nombre || '',
        apellido: person.apellido || '',
        email: person.email || '',
        telefono: person.telefono || '',
        cargo: person.cargo || ''
      };
    }
    return {
      id: '', // Campo añadido para la creación
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      cargo: ''
    };
  };

  const [formData, setFormData] = useState(getInitialState);

  useEffect(() => {
    // Sincroniza el formulario si la 'person' a editar cambia
    setFormData(getInitialState());
  }, [person, isEditMode]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
   // console.log(e)
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditMode ? 'Editar Perfil' : 'Crear Perfil'}</h2>
        <form onSubmit={handleSubmit}>

          {/* Campo Identificación (solo en modo creación) */}
          {!isEditMode && (
            <div className="form-group">
              <label htmlFor="id">Identificación</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Ej: 123456789"
                required
              />
            </div>
          )}
          
          {/* Campo Nombre */}
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

          {/* Campo Apellido */}
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

          {/* Campo Email */}
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

          {/* Campo Teléfono */}
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

          {/* Campo Cargo (opcional) */}
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
