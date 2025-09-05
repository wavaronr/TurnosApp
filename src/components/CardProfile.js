import { getDataPersons } from './getDataPerson';
import React, { useState, useEffect } from 'react';
import '../css/Profile.css';

function CardProfile() {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const personsData = await getDataPersons();
      setPersons(personsData);
      setLoading(false);
    };

    fetchData();
  }, []);

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
  // console.log(getDataPersons())

  return (
    <div className="profile-container">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="profile-grid">
        {filteredPersons.map(({ id, name, cargo }) => (
          <div className="profile-card" key={id}>
            <div className="profile-card-header">
              <h5 className="profile-name">{name}</h5>
            </div>
            <div className="profile-card-body">
              <p><strong>Identificación:</strong> {id}</p>
              <p><strong>Cargo:</strong> {cargo}</p>
            </div>
            <div className="profile-card-footer">
              <button className="btn-edit">Editar</button>
              <button className="btn-delete">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardProfile;
