import { useNavigate, useLocation } from 'react-router-dom';

function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = ['Home', 'Calendario', 'Perfiles'];

  // Derivar el índice activo de la ruta actual
  const currentPath = location.pathname.substring(1);
  let activeIndex = buttons.findIndex(button => button.toLowerCase() === currentPath.toLowerCase());

  // Si la ruta es '/', establecer Home como activo
  if (location.pathname === '/') {
    activeIndex = 0;
  }

  const handleClick = (index) => {
    navigate(`/${buttons[index]}`);
  };

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
