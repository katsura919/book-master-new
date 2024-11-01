// MessageBox.js
import React, { useEffect } from 'react';
import './MessageBox.css'; // Import the CSS file

const MessageBox = ({ message, type, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Call the onClose function to clear the message
    }, duration || 5000); // Default to 5 seconds if no duration is provided

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [duration, onClose]);

  return (
    <div className={`message-box ${type}`}>
      {message}
    </div>
  );
};

export default MessageBox;
