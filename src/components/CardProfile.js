
import { getDataPersons } from './getDataPerson';
import React, { useState, useEffect } from 'react';
import '../css/Profile.css';
import EditProfileForm from './EditProfileForm';

function CardProfile() {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [editingPerson, setEditingPerson] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const personsData = await getDataPersons();
      setPersons(personsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleEdit = (person) => {
    setEditingPerson(person);
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
  };

  const handleSave = (formData) => {
    if (formData.id) { 
      setPersons(persons.map(p => p.id === formData.id ? formData : p));
    } else { 
      const newId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1;
      setPersons([...persons, { ...formData, id: newId }]);
    }
    handleClose();
  };

  const handleDelete = (personId) => {
    setPersons(persons.filter(p => p.id !== personId));
  };

  const handleClose = () => {
    setEditingPerson(null);
    setIsCreating(false);
  };

  const filteredPersons = Array.isArray(persons)
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

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
