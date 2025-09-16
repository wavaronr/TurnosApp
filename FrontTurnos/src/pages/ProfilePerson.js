import React, { useState, useEffect } from 'react';
import { getAllDataPersons } from '../services/getDataPerson';

function ProfilePerson({ weekNumber }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const profile = await getAllDataPersons();
      setProfiles(profile);
      setLoading(false);
    };

    fetchData();
  }, []);

  const weeklyPersons = profiles.find(
    (profile) => profile.week === weekNumber
  );

  return (
    <>
      {loading ? (
        <div>Cargando...</div>
      ) : weeklyPersons ? (
        <div className="card">
          <h5 className="card-title">Semana {weeklyPersons.week}</h5>
          <div className="card-body">
            {weeklyPersons.asigned?.map(({ name, cargo, buttons }, index) => (
              <p className="card-text" key={name + index}>
                Persona:{name}
                <br />
                Cargo:{cargo}
                <br />
                <button
                  className="btn btn-outline-success"
                  key={buttons + index}
                >
                  {buttons[0]}
                </button>{' '}
                <button
                  className="btn btn-outline-danger"
                  key={buttons + index}
                >
                  {buttons[1]}
                </button>
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div>Nada que mostrar</div>
      )}
    </>
  );
}

export default ProfilePerson;
