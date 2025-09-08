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

    // For login/logout which don't trigger 'storage' event in the same tab
    const checkAuth = () => {
        handleStorageChange();
    };

    // Check on every navigation change as well
    checkAuth();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  const buttons = ['Home', 'Calendario', 'Perfiles'];

  const currentPath = location.pathname.substring(1);
  let activeIndex = buttons.findIndex(button => button.toLowerCase() === currentPath.toLowerCase());

  if (location.pathname === '/') {
    activeIndex = 0;
  }

  const handleClick = (index) => {
    navigate(`/${buttons[index]}`);
  };

  // Do not render the menu if the user is not authenticated or is on the login page
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
