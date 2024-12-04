import React from 'react';
import Modal from 'react-modal'; // Import react-modal
import './AddBookModal.css'; // Import your modal styles

// Set the app element for accessibility (screen readers)
Modal.setAppElement("#root");

const AddBookModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen} // Control modal visibility
      onRequestClose={onClose} // Close the modal when requested (like when clicking outside or pressing Esc)
      className="modal-content" // Your modal content styling
      overlayClassName="modal-overlay" // Your modal overlay styling
      contentLabel="Add Book Modal" // Accessibility label
    >
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      {children} {/* Render children inside the modal */}
    </Modal>
  );
};

export default AddBookModal;
