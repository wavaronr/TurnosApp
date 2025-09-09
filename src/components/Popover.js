import React from 'react';
import ReactDOM from 'react-dom';
import '../css/Popover.css';

const popoverRoot = document.getElementById('popover-root');

const Popover = ({ children, position, visible }) => {
  if (!popoverRoot) return null;

  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  // Add the 'visible' class based on the prop
  const containerClassName = `popover-container ${visible ? 'visible' : ''}`;

  return ReactDOM.createPortal(
    <div className={containerClassName} style={style}>
      <div className="popover-content">
        {children}
      </div>
    </div>,
    popoverRoot
  );
};

export default Popover;