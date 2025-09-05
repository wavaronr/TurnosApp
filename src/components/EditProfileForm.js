
import React, { useState, useEffect } from 'react';
import '../css/EditProfileForm.css';

function EditProfileForm({ person, onSubmit, onClose }) {
  const isEditMode = Boolean(person);
  const initialState = isEditMode ? { ...person } : { name: '', cargo: '' };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(initialState);
  }, [person]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditMode ? 'Editar Perfil' : 'Crear Perfil'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              required
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
              placeholder="Ej: Desarrollador Frontend"
              required
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
