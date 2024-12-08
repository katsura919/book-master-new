import React from "react";
import Modal from "react-modal";
import "./BorrowingTermsModal.css";

const BorrowingTermsModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="borrowing-modal-content"
      overlayClassName="borrowing-modal-overlay"
      ariaHideApp={false}
    >
      <button className="borrowing-modal-close-btn" onClick={onClose}>
        &times;
      </button>
      <h2 className="borrowing-modal-header">Borrowing Terms and Conditions</h2>
      <p className="borrowing-modal-text">
        Books in this section may be charged out to eligible borrowers of the
        university. These include bona fide students and permanent employees
        through the presentation of an identification card.
      </p>
      <table className="borrowing-modal-table">
        <thead>
          <tr>
            <th>Type of Borrower</th>
            <th>Number of Books</th>
            <th>Loaning Period</th>
            <th>Renewal Period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Student</td>
            <td>3</td>
            <td>7 Days</td>
            <td>7 Days</td>
          </tr>
          <tr>
            <td>Permanent Faculty</td>
            <td>10</td>
            <td>1 Semester</td>
            <td>1 Semester</td>
          </tr>
          <tr>
            <td>Permanent Staff</td>
            <td>10</td>
            <td>7 Days</td>
            <td>7 Days</td>
          </tr>
        </tbody>
      </table>
      <p className="borrowing-modal-text">
        Any library user who fails to return the library materials on time will
        be charged with a fee of ₱5.00 per day. All library materials should be
        returned promptly.
      </p>
    </Modal>
  );
};

export default BorrowingTermsModal;
