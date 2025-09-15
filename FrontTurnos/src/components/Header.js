import React, { useContext } from 'react'; // 1. Importar useContext
import NavMenu from './NavMenu';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext'; // 2. Importar el contexto
import LogoutIcon from '../icons/LogoutIcon';
import HeaderBackground from '../icons/HeaderBackground';

function Header() {
  const navigate = useNavigate();
  // 3. Obtener el perfil y la función de logout del contexto
  const { profile, logout } = useContext(ProfileContext);

  const handleLogout = () => {
    logout(); // 4. Usar la función logout del contexto
    navigate('/', { replace: true });
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <NavMenu />
        {/* 5. Renderizar basado en si el objeto 'profile' existe */}
        {profile && (
          <div style={{ position: 'absolute', top: 10, right: 20, color: 'white', zIndex: 1050, display: 'flex', alignItems: 'center' }}>
            {/* 6. Usar los datos del objeto profile */}
            <span>{profile.email} ({profile.role})</span>
            <button onClick={handleLogout} style={{ marginLeft: '15px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0' }}>
              <LogoutIcon />
            </button>
          </div>
        )}
        <div
          key="background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: -1,
          }}
        >
          <HeaderBackground />
        </div>
      </div>
    </>
  );
}

export default Header;
