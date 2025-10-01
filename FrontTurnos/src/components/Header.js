import NavMenu from './NavMenu';
import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Botones de rutas para menú móvil
const mobileMenuButtons = [
  { label: 'Home', path: '/home' },
  { label: 'Calendario', path: '/calendario' },
  { label: 'Programacion', path: '/programacion' },
  { label: 'Perfiles', path: '/perfiles' },
  { label: 'Rutas', path: '/rutas' },
];
import { ProfileContext } from '../context/ProfileContext';
import LogoutIcon from '../icons/LogoutIcon';
import HeaderBackground from '../icons/HeaderBackground';
import { MenuIcon } from '../icons/MenuIcon';
import '../css/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout } = useContext(ProfileContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Si no hay perfil, no renderizar nada (protección contra errores)
  if (!profile) return null;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
  {/* NavMenu solo para escritorio, el menú móvil va abajo */}
  <div className="nav-menu-desktop"><NavMenu /></div>
        {profile && (
          <>
            <div className="user-info-desktop">
              <div style={{ position: 'absolute', top: 10, right: 20, color: 'white', zIndex: 1050, display: 'flex', alignItems: 'center' }}>
                <span>{profile.email} ({profile.role})</span>
                <button onClick={handleLogout} style={{ marginLeft: '15px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0' }}>
                  <LogoutIcon />
                </button>
              </div>
            </div>

            <div className="user-info-mobile">
              <button
                onClick={toggleMenu}
                className={`mobile-menu-toggle${location.pathname === '/programacion' ? ' programming' : ''}`}
                style={{ top: 22, right: 18 }}
              >
                <MenuIcon />
              </button>
              {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
              <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}> 
                <div className="mobile-menu-header">
                  <span>{profile.email} ({profile.role})</span>
                </div>
                <hr />
                {/* Menú de rutas vertical */}
                <nav className="mobile-nav-menu">
                  <ul className="mobile-nav-list">
                    {mobileMenuButtons.map(btn => (
                      <li key={btn.path} className="mobile-nav-item">
                        <button
                          className="mobile-nav-button"
                          onClick={() => {
                            navigate(btn.path);
                            closeMenu();
                          }}
                        >
                          {btn.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
                <hr />
                <button onClick={handleLogout} className="mobile-menu-logout">
                  <LogoutIcon />
                  <span style={{ marginLeft: '10px' }}>Logout</span>
                </button>
              </div>
            </div>
          </>
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
