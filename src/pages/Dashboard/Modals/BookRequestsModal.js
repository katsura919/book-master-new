import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal"; 
import './BookRequestsModal.css';  


Modal.setAppElement("#root");

const BookRequestsModal = ({ isOpen, onClose, bookId }) => {
  const apiBaseUrl = 'https://book-master-server.onrender.com'; 
  const [requests, setRequests] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);      

  // Fetch book requests data when the modal is opened or bookId changes
  useEffect(() => {
    if (!bookId) return;  // If no bookId is provided, do nothing

    const fetchBookRequests = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${apiBaseUrl}/book-requests/${bookId}`);
        setRequests(response.data);  // Set the response data in the state
      } catch (err) {
        setError("Failed to fetch data");  // Set error if the request fails
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchBookRequests();
  }, [bookId]);  // This effect runs when the bookId changes

  return (
    <Modal
      isOpen={isOpen} // Control modal visibility
      onRequestClose={onClose} // Close the modal when requested (like when clicking outside or pressing Esc)
      className="modal-content" // Your modal content styling
      overlayClassName="modal-overlay" // Your modal overlay styling
      contentLabel="Book Requests Modal" // Accessibility label
    >
      <h2>Borrowers</h2>
      <button onClick={onClose}>Close</button>

      {loading ? (
        <p>Loading...</p>  // Show loading indicator while fetching
      ) : error ? (
        <p>No Borrowers</p>  // Show error message if there's an error
      ) : requests.length > 0 ? (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Borrower Type</th>
              <th>Status</th>
              <th>Request Created</th>
              <th>Due Date</th>
              <th>Overdue Days</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.req_id}>
                <td>{request.first_name} {request.last_name}</td>
                <td>{request.email}</td>
                <td>{request.contact_number}</td>
                <td>{request.borrower_type}</td>
                <td>{request.status}</td>
                <td>{new Date(request.req_created).toLocaleString()}</td>
                <td>{request.req_approve ? new Date(request.req_approve).toLocaleString() : 'N/A'}</td>
                <td>{request.overdue_days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests found for this book.</p>  // No data message
      )}
    </Modal>
  );
};

export default BookRequestsModal;
