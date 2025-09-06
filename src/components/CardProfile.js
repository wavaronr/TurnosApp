import React, { useState } from 'react';
import '../css/Profile.css';
import EditProfileForm from './EditProfileForm';
import { useCalendar } from '../context/CalendarContext'; // 1. Importar el hook del contexto

// 2. Se eliminan las props. El componente ahora es autónomo.
function CardProfile() {
  // 3. Obtener el estado y las funciones del contexto.
  const { people, savePerson, deletePerson } = useCalendar();

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

  // 4. Llama a la función savePerson del contexto.
  const handleSave = (formData) => {
    savePerson(formData);
    handleClose();
  };

  // 5. Llama a la función deletePerson del contexto.
  const handleDelete = (personId) => {
    // Aquí se podría añadir una confirmación antes de borrar.
    deletePerson(personId);
  };

  const handleClose = () => {
    setEditingPerson(null);
    setIsCreating(false);
  };

  // El resto de la lógica permanece igual, pero ahora usa `people` del contexto.
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
          // onSubmit ahora llama a handleSave, que a su vez usa el contexto.
          onSubmit={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default CardProfile;
