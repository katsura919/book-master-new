// RequestModal.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RequestModal.css';
import MessageBox from '../../../components/MessageBox';

const RequestModal = ({ isOpen, onClose, requestID }) => {
  const [requestDetails, setRequestDetails] = useState(null); // Use null for initial state
  const [error, setError] = useState(null); // State for error handling
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');


  const fetchRequestDetails = async () => {
    if (requestID) {
      try {
        const response = await fetch(`http://localhost:5000/req/${requestID}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch request details');
        }

        const data = await response.json();
        setRequestDetails(data); // Set request details
        console.log(requestDetails);
      } catch (error) {
        console.error('Error fetching request details:', error);
        setError(error.message); // Set error message
      }
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestID, isOpen]); // Re-fetch if requestID changes or modal opens

  const updateBookStatus = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:5000/update-book-status/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_status: 'RETURNED' })
      });

      if (response.ok) {
        console.log('Book status updated');
        // Optionally refresh request details
        await fetchRequestDetails();
      } else {
        console.error('Failed to update book status', bookId);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApprove = async (reqId) => {
    try {
      const response = await axios.post('http://localhost:5000/approve-request', { reqId });
      if (response.status === 200) {
        setMessage('Request approved successfully!');
        setMessageType('success');
        await fetchRequestDetails(); // Refresh the list after approving
      }
    } catch (error) {
      console.error('Error approving the request:', error);
      setMessage('Failed to approve the request.');
      setMessageType('error');
    }
  };

  const handleDecline = async (reqId) => {
    try {
      const response = await axios.post('http://localhost:5000/reject-request', { reqId });
      if (response.status === 200) {
        setMessage('Request declined successfully!');
        setMessageType('error');
        await fetchRequestDetails(); // Refresh the list after declining
      }
    } catch (error) {
      console.error('Error declining the request:', error);
      setMessage('Failed to decline the request.');
      setMessageType('error');
    }
  };

  const handleReturn = async (reqId) => {
    try {
      const response = await axios.post('http://localhost:5000/return-request', { reqId });
      if (response.status === 200) {
        setMessage('Request returned successfully!');
        setMessageType('error');
        await fetchRequestDetails(); // Refresh the list after declining
      }
    } catch (error) {
      console.error('Error returning the request:', error);
      setMessage('Failed to return the request.');
      setMessageType('error');
    }
  };

  if (!isOpen) return null; // Don't render if not open

  return (
      <div className="modal-overlay"> 
        
        <div className="modal-content">
          {message && (
            <MessageBox
              message={message}
              type={messageType}
              duration={5000}
              onClose={() => setMessage(null)}
            />
           )}
           
          <h2>Request Details</h2>
          {error ? ( // Show error state if there is an error
            <p>Error: {error}</p>
          ) : requestDetails ? ( // Show request details
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
                    <th>Book Status</th>
                    <th>Actions</th>
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
                        <td>{book.book_status}</td>
                        <td>
                          <button 
                            onClick={() => updateBookStatus(book.book_id)}
                            disabled={book.book_status === 'RETURNED' || requestDetails?.status === 'Pending' || requestDetails?.status === 'Rejected'}
                            className={book.book_status === 'RETURNED' ? 'return-book' : 'return-book'}
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No books available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No details available.</p> // Show this if no request details are present
          )}
          <div>
              <button
              onClick={() => handleApprove(requestDetails?.req_id)}
              disabled={requestDetails?.status === 'Approved'  || requestDetails?.status === 'Returned'}
              className={requestDetails?.status === 'Approved' ? 'approved' : 'approved'}
              >
              {requestDetails?.status === 'Approved' ? 'Approved' : 'Approve'}
              </button>

              <button
              onClick={() => handleDecline(requestDetails?.req_id)}
              disabled={requestDetails?.status === 'Rejected' || requestDetails?.status === 'Overdue' || requestDetails?.status === 'Returned'}
              className={requestDetails?.status === 'Rejected' ? 'rejected' : 'rejected'}
              >
              {requestDetails?.status === 'Rejected' ? 'Rejected' : 'Reject'}
              </button>

              <button
               onClick={() => {
                if (window.confirm("Are you sure you want to return this book request?")) {
                  handleReturn(requestDetails?.req_id);
                }
              }}
              disabled={requestDetails?.status === 'Returned' || requestDetails?.status === 'Rejected'}
              className={requestDetails?.status === 'Returned' ? 'returned' : 'Returned'}
              >
              {requestDetails?.status === 'Returned' ? 'Returned' : 'Return'}
              </button>

              <button 
              onClick={onClose}>
              Close
              </button>

          </div>
        
        </div>
      </div>
  );
};

export default RequestModal;
