// src/components/Modal.js
import React from 'react';
import './AddBookModal.css'; // Import your modal styles

const AddBookModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render anything if the modal isn't open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default AddBookModal;
