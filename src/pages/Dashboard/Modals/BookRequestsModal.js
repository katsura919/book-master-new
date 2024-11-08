import React, { useEffect, useState } from "react";
import axios from "axios";
import './BookRequestsModal.css'

const BookRequestsModal = ({ isOpen, onClose, bookId }) => {
  const [requests, setRequests] = useState([]);  // State to store fetched data
  const [loading, setLoading] = useState(true);   // Loading state to handle loading UI
  const [error, setError] = useState(null);       // Error state to handle errors

  // Fetch book requests data when the modal is opened or bookId changes
  useEffect(() => {
    if (!bookId) return;  // If no bookId is provided, do nothing

    const fetchBookRequests = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`http://localhost:5000/book-requests/${bookId}`);
        setRequests(response.data);  // Set the response data in the state
      } catch (err) {
        setError("Failed to fetch data");  // Set error if the request fails
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchBookRequests();
  }, [bookId]);  // This effect runs when the bookId changes

  if (!isOpen) return null;  // Don't render modal if it's not open

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Book Requests for Book ID: {bookId}</h2>
        <button onClick={onClose}>Close</button>

        {loading ? (
          <p>Loading...</p>  // Show loading indicator while fetching
        ) : error ? (
          <p>{error}</p>  // Show error message if there's an error
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
      </div>
    </div>
  );
};

export default BookRequestsModal;
