
import React from 'react';
import '../css/AssignPersonModal.css';

function ErrorModal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Error</h5>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
