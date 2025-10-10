import React, { useState, useContext } from 'react';
import '../css/Profile.css';
import EditProfileForm from '../components/EditProfileForm';
import { useCalendar } from '../context/CalendarContext';
import { ProfileContext } from '../context/ProfileContext';
import AvatarIcon from '../icons/AvatarIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';

function CardProfile() {
  const { people, savePerson, deletePerson } = useCalendar();
  const { profile } = useContext(ProfileContext);
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

  const handleSave = (formData) => {
    if (isCreating) {
      // Creating a new person
      savePerson(formData); // Asume que savePerson maneja la creación
    } else {
      // Updating an existing person
      savePerson(formData, editingPerson._id); // Envía el ID para la actualización 
    }
    handleClose();
  };

  const handleDelete = (personId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este perfil?')) {
      deletePerson(personId);
    }
  };

  const handleClose = () => {
    setEditingPerson(null);
    setIsCreating(false);
  };

  const filteredPersons = Array.isArray(people)
  ? people.filter(
      (person) =>
        person &&
        person.nombre &&
        person.apellido &&
        `${person.nombre} ${person.apellido}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
  : [];
  
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {profile?.role === 'ADM' && <button className="btn-create" onClick={handleOpenCreate}>Crear Perfil</button>}
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o apellido..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="profile-grid">
        {filteredPersons.map((person) => (
          <div className="profile-card" key={person._id}>
            <div className="profile-card-header">
              <div className="profile-avatar">
                <AvatarIcon />
              </div>
              <h5 className="profile-name">{`${person.nombre} ${person.apellido}`}</h5>
              <p className="profile-cargo">{person.cargo}</p>
            </div>
            <div className="profile-card-body">
              <p><strong>Identificación:</strong> {person.identificacion}</p>
            </div>
            {profile?.role === 'ADM' && (
              <div className="profile-card-footer">
                <button className="btn-icon btn-edit" onClick={() => handleEdit(person)}>
                  <EditIcon />
                </button>
                <button className="btn-icon btn-delete" onClick={() => handleDelete(person._id)}>
                  <DeleteIcon />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {(editingPerson || isCreating) && (
        <EditProfileForm
          person={editingPerson}
          onSubmit={handleSave}
          onClose={handleClose}
          isEditMode={!isCreating}
          profile={profile}
        />
      )}
    </div>
  );
}

export default CardProfile;
