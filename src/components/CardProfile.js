import React, { useState } from 'react';
import '../css/Profile.css';
import EditProfileForm from './EditProfileForm';

// Recibe la lista de personas y las funciones para manipularla como props
function CardProfile({ people, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPerson, setEditingPerson] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (person) => {
    setEditingPerson(person);
    setIsCreating(false);
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingPerson(null);
  };

  // Llama a la función onSave que viene de App.js
  const handleSave = (formData) => {
    onSave(formData);
    handleClose();
  };

  // Llama a la función onDelete que viene de App.js
  const handleDelete = (personId) => {
    onDelete(personId);
  };

  const handleClose = () => {
    setEditingPerson(null);
    setIsCreating(false);
  };

  // Usa la prop 'people' en lugar de un estado local
  const filteredPersons = Array.isArray(people)
    ? people.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="btn-create" onClick={handleOpenCreate}>Crear Perfil</button>
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="profile-grid">
        {filteredPersons.map((person) => (
          <div className="profile-card" key={person.id}>
            <div className="profile-card-header">
              <h5 className="profile-name">{person.name}</h5>
            </div>
            <div className="profile-card-body">
              <p><strong>Identificación:</strong> {person.id}</p>
              <p><strong>Cargo:</strong> {person.cargo}</p>
            </div>
            <div className="profile-card-footer">
              <button className="btn-edit" onClick={() => handleEdit(person)}>Editar</button>
              <button className="btn-delete" onClick={() => handleDelete(person.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {(editingPerson || isCreating) && (
        <EditProfileForm
          person={editingPerson}
          onSubmit={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default CardProfile;
