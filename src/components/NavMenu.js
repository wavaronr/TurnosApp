import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    const checkAuth = () => {
        handleStorageChange();
    };

    checkAuth();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  const buttons = ['Home', 'Calendario', 'Programacion', 'Perfiles'];

  const currentPath = location.pathname.substring(1);
  let activeIndex = buttons.findIndex(button => button.toLowerCase() === currentPath.toLowerCase());

  if (location.pathname === '/') {
    activeIndex = 0;
  }

  const handleClick = (index) => {
    const path = buttons[index].toLowerCase();
    navigate(`/${path}`);
  };

  if (!isAuthenticated || location.pathname === '/' || location.pathname.toLowerCase() === '/login') {
    return null;
  }

  return (
    <nav className="nav-menu">
      <ul className="nav-list">
        {buttons.map((button, index) => (
          <li className="nav-item" key={index}>
            <button
              className={`nav-button ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleClick(index)}
            >
              {button}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavMenu;
