import React from 'react';
import ReactDOM from 'react-dom';
import '../css/Popover.css'; // <-- We are now using the Glassmorphism CSS

const popoverRoot = document.getElementById('popover-root');

const Popover = ({ children, position, visible }) => {
  if (!popoverRoot) return null;

  // Position the popover slightly above the cursor/element
  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    // We now control positioning logic here for better alignment
    transform: `translate(-50%, -100%)`,
    // Add a little vertical offset
    marginTop: '-10px'
  };

  // The 'visible' class now triggers our new CSS animations
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
