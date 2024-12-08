// MessageBox.js
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'; // Import react-modal
import './MessageBox.css'; // Import the CSS file

// Ensure the modal can be opened on the root element
Modal.setAppElement('#root');

const MessageBox = ({ message, type, duration, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Close modal after specified duration
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsOpen(false); // Close the modal after the specified duration
        onClose(); // Call the onClose function to clear the message
      }, duration);

      return () => clearTimeout(timer); // Cleanup timer on component unmount or message change
    }
  }, [message, duration, onClose]);

  return (
    <Modal
      isOpen={isOpen} // Modal will close when `isOpen` is false
      onRequestClose={() => setIsOpen(false)} // Close modal on close request
      contentLabel="Message Box"
      className="message-box-modal"
      overlayClassName="message-box-overlay"
      closeTimeoutMS={100} // Animation duration for modal fade out
    >
      <div className={`message-box ${type}`}>
        {message}
      </div>
    </Modal>
  );
};

export default MessageBox;
