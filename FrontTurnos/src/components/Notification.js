import React, { useState, useEffect } from 'react';
import '../css/Notification.css';
import { SuccessIcon, ErrorIcon } from '../assets/icons'; // Importar desde el archivo central

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
