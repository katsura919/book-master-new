
import React from 'react';
import Modal from 'react-modal';
import { QRCodeSVG } from 'qrcode.react';
import './QRCodeModal.css'; // 

const QRCodeModal = ({ modalIsOpen, setModalIsOpen, trackingURL }) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="QR Code Modal"
      className="qr-modal"
      overlayClassName="qr-modal-overlay"
    >
      <h2>Your request has been submitted!</h2>
      <p>Scan the QR code to track your book borrow request:</p>
      <QRCodeSVG value={trackingURL} size={256} /> {/* Generate QR code */}
      <p>Or visit: <a href={trackingURL} target="_blank" rel="noopener noreferrer">{trackingURL}</a></p>
      <button onClick={() => setModalIsOpen(false)}>Close</button>
    </Modal>
  );
};

export default QRCodeModal;
