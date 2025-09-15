import React, { useState, useContext } from 'react'; // 1. Importar useContext
import '../css/Profile.css';
import EditProfileForm from '../components/EditProfileForm';
import { useCalendar } from '../context/CalendarContext';
import { ProfileContext } from '../context/ProfileContext'; // 2. Importar ProfileContext
import AvatarIcon from '../icons/AvatarIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';

function CardProfile() {
  const { people, savePerson, deletePerson } = useCalendar();
  const { profile } = useContext(ProfileContext); // 3. Obtener profile del contexto
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPerson, setEditingPerson] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  // const userProfile = localStorage.getItem('profile'); // Ya no es necesario

  const handleEdit = (person) => {
    setEditingPerson(person);
    setIsCreating(false);
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingPerson(null);
  };

  const handleSave = (formData) => {
    savePerson(formData);
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
        person && // Ensure person object exists
        person.name && // Ensure name property exists
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];
  console.log(people)

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* 4. Usar el rol del perfil del contexto */}
        {profile?.role === 'ADM' && <button className="btn-create" onClick={handleOpenCreate}>Crear Perfil</button>}
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
              <div className="profile-avatar">
                <AvatarIcon />
              </div>
              <h5 className="profile-name">{person.name}</h5>
              <p className="profile-cargo">{person.cargo}</p>
            </div>
            <div className="profile-card-body">
              <p><strong>Identificación:</strong> {person.id}</p>
            </div>
            {/* 4. Usar el rol del perfil del contexto */}
            {profile?.role === 'ADM' && (
              <div className="profile-card-footer">
                <button className="btn-icon btn-edit" onClick={() => handleEdit(person)}>
                  <EditIcon />
                </button>
                <button className="btn-icon btn-delete" onClick={() => handleDelete(person.id)}>
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
        />
      )}
    </div>
  );
}

export default CardProfile;
