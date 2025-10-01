import React, { useContext, useState } from 'react';
import NavMenu from './NavMenu';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext';
import LogoutIcon from '../icons/LogoutIcon';
import HeaderBackground from '../icons/HeaderBackground';
import { MenuIcon } from '../icons/MenuIcon';
import '../css/Header.css';

function Header() {
  const navigate = useNavigate();
  const { profile, logout } = useContext(ProfileContext);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <NavMenu />
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
              <button onClick={toggleMenu} className="mobile-menu-toggle">
                <MenuIcon />
              </button>
              {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
              <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                  <span>{profile.email} ({profile.role})</span>
                </div>
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
