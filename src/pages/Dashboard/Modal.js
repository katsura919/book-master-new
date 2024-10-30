// Modal.js
import React from 'react';
import './Modal.css'; // Ensure you have your modal styles

const Modal = ({ isOpen, onClose, requestDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Request Details</h2>
        {requestDetails ? (
          <div>
            <p><strong>Request ID:</strong> {requestDetails.req_id}</p>
            <p><strong>Name:</strong> {`${requestDetails.borrower.first_name} ${requestDetails.borrower.last_name}`}</p>
            <p><strong>Type:</strong> {requestDetails.borrower.borrower_type}</p>
            <p><strong>Status:</strong> {requestDetails.status}</p>
            <p><strong>Request Created:</strong> {requestDetails.req_created}</p>
            <p><strong>Approval Date:</strong> {requestDetails.req_approve || 'N/A'}</p>

            {/* Table for book details */}
            <h3>Books:</h3>
            <table className="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Hours Due</th>
                  <th>Penalty</th>
                </tr>
              </thead>
              <tbody>
                {requestDetails.books.length > 0 ? (
                  requestDetails.books.map((book) => (
                    <tr key={book.book_id}>
                      <td>{book.title}</td>
                      <td>{book.due_date}</td>
                      <td>{book.hours_due} hrs</td>
                      <td>₱ {book.penalty}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No books available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No details available.</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
