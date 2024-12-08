import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './BorrowerModal.css'
const BorrowerModal = ({ isOpen, onRequestClose, borrowerId }) => {
  const apiBaseUrl = 'http://localhost:5000'; 
  const [borrowerRequest, setBorrowerRequest] = useState(null);

  // Fetch borrower requests when the modal opens and borrowerId is provided
  useEffect(() => {
    if (isOpen && borrowerId) {
      const fetchBorrowerRequest = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/api/borrowers/${borrowerId}/requests`);
          setBorrowerRequest(response.data); // Assuming the response data is an array of requests
        } catch (error) {
          console.error("Error fetching borrower request:", error);
        }
      };

      fetchBorrowerRequest();
    }
  }, [isOpen, borrowerId]); // Re-fetch when modal opens or borrowerId changes

  return (
    <Modal 
    isOpen={isOpen} 
    onRequestClose={onRequestClose} 
    contentLabel="Borrower Request Details" 
    className="borrower-modal"
    overlayClassName="borrower-modal-overlay">
      <h2 className="borrower-modal__title">Borrower Request Details</h2>
      
      {borrowerRequest === null ? (
        <p className="borrower-modal__loading">No Requests Found</p>  // Loading state
      ) : borrowerRequest.length === 0 ? (
        <p className="borrower-modal__no-requests">No requests found for this borrower.</p>  // Case when there are no requests
      ) : (
        <div className="borrower-modal__request-list">
          <ul className="borrower-modal__book-list">
            {borrowerRequest.map((request) => (
              <li key={request.req_id} className="borrower-modal__book-item">
                <h4 className="borrower-modal__book-title">Request ID: {request.req_id}</h4>
                <p className="borrower-modal__book-status">Status: {request.status}</p>
                <p className="borrower-modal__book-date">Request Created: {request.req_created}</p>
                <p className="borrower-modal__book-approval">Approved: {request.req_approve || 'Not Approved'}</p>
                <p className="borrower-modal__book-overdue">Overdue Days: {request.overdue_days}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="borrower-modal__close-btn" onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default BorrowerModal;
