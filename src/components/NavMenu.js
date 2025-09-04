import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NavMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const buttons = ['Home', 'Calendario', 'Perfiles'];

  const handleClick = (index) => {
    setActiveIndex(index);
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
