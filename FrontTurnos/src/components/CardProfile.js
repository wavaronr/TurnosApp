import React, { useState, useContext } from 'react'; // 1. Importar useContext
import '../css/Profile.css';
import EditProfileForm from './EditProfileForm';
import { useCalendar } from '../context/CalendarContext';
import { ProfileContext } from '../context/ProfileContext'; // 2. Importar ProfileContext

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
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="btn-icon btn-delete" onClick={() => handleDelete(person.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
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
