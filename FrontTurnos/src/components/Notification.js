import React, { useState, useEffect } from 'react';
import '../css/Notification.css';

// --- SVGs Rediseñados: Más Impactantes y Modernos ---
const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" >
    <circle cx="12" cy="12" r="11" fill="#28a745"/>
    <path d="M8 11.8571L10.8 14.4L16 9.6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#dc3545"/>
    <path d="M15 9L9 15" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 9L15 15" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

const Notification = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) {
    return null;
  }

  const icon = type === 'success' ? <SuccessIcon /> : <ErrorIcon />;

  return (
    // Eliminamos la clase de color del ícono porque el SVG ya lo tiene
    <div className={`notification ${type}`}>
      <div className="notification-icon">{icon}</div>
      <p className="notification-message">{message}</p>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {children(addNotification)} 
      <div className="notification-container">
        {notifications.map(({ id, message, type }) => (
          <Notification 
            key={id} 
            message={message} 
            type={type} 
            onClose={() => removeNotification(id)}
          />
        ))}
      </div>
    </>
  );
};
