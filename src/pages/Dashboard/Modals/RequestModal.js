import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './RequestModal.css';
import MessageBox from '../../../components/MessageBox';
import { FaEllipsisV } from 'react-icons/fa'; // For the 3-dots icon
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable';

const RequestModal = ({ isOpen, onClose, requestID, refreshList }) => {
  const apiBaseUrl = 'http://localhost:5000';
  const [requestDetails, setRequestDetails] = useState(null); // Use null for initial state
  const [error, setError] = useState(null); // State for error handling
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For dropdown menu

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
        body: JSON.stringify({ book_status: 'RETURNED' }),
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

  // PDF generation function
  const generatePDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
  
  // Title
  const title = 'INVOICE';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const titleWidth = doc.getTextWidth(title); // Get the width of the text
  const titleX = (pageWidth - titleWidth) / 2; // Calculate the X position to center
  doc.text(title, titleX, 20); // Center the title horizontally
  
  // Request ID and Borrower Information
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`University of Science and Technology of Southern Philipines`, 50, 30);
  doc.text(`Request #: ${requestDetails?.req_id || 'N/A'}`, 20, 42);
  doc.text(`Name: ${requestDetails?.borrower.first_name} ${requestDetails?.borrower.last_name || 'N/A'}`, 20, 50);
  doc.text(`Type: ${requestDetails?.borrower.borrower_type || 'N/A'}`, 20, 58);
  doc.text(`Status: ${requestDetails?.status || 'N/A'}`, 20, 66);
  doc.text(`Request Created: ${requestDetails?.req_created || 'N/A'}`, 20, 74);
  doc.text(`Approval Date: ${requestDetails?.req_approve || 'N/A'}`, 20, 82);

  // Books Table Header and Data
  const booksData = requestDetails?.books || [];
  const tableColumns = ['Title', 'Due Date', 'Hours Due', 'Penalty', 'Status'];
  const tableRows = booksData.map(book => [
    book.title || 'N/A',
    book.due_date || 'N/A',
    `${book.hours_due || '0'} hrs`,
    `${book.penalty || '0'} php`,
    book.book_status || 'N/A'
  ]);

  // Add table to the PDF
  doc.autoTable({
    startY: 100, // Set where the table should start
    head: [tableColumns], // Table headers
    body: tableRows, // Table rows with data
    theme: 'grid', // Optional: You can change the table theme (like 'striped', 'grid', 'plain', etc.)
    headStyles: { fontSize: 12, fontStyle: 'bold' },
    styles: { fontSize: 10 },
  });

  // Save PDF
  doc.save(`Request_${requestDetails?.req_id || 'unknown'}.pdf`);
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
        await fetchRequestDetails(); // Refresh the list after returning
      }
    } catch (error) {
      console.error('Error returning the request:', error);
      setMessage('Failed to return the request.');
      setMessageType('error');
    }
  };

  const handleDeleteRequest = async (reqId) => {
    if (window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`http://localhost:5000/delete-request/${reqId}`);
        if (response.status === 200) {
          setMessage('Request deleted successfully!');
          setMessageType('success');
          refreshList(); // Refresh the main page list
          onClose(); // Close the modal after deletion
        } else {
          setMessage('Failed to delete the request.');
          setMessageType('error');
        }
      } catch (error) {
        console.error('Error deleting the request:', error);
        setMessage('An error occurred while deleting the request.');
        setMessageType('error');
      }
    }
  };

  const renewBook = async (book_id, req_id, borrower_type) => {
    const payload = {
      book_id,
      req_id,
      borrower_type,
    };
    
    console.log(payload);
  
    try {
      const response = await axios.post(`${apiBaseUrl}/renew-book`, payload);
      console.log('Book renewed successfully:', response.data);
      fetchRequestDetails(); // Refresh the request details
    } catch (error) {
      console.error('Error renewing book:', error.response?.data || error.message);
    }
  
  };
  
  
  
  const removeBook = async (bookId, reqId) => {
    if (window.confirm('Are you sure you want to remove this book?')) {
      try {
        const response = await axios.delete(`${apiBaseUrl}/remove-book`, { data: { book_id: bookId, req_id: reqId } });
        alert('Book removed successfully!');
        fetchRequestDetails(); // Refresh the request details
      } catch (error) {
        console.error('Error removing book:', error);
        alert('Failed to remove the book.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Request Details"
      className="request-modal"
      overlayClassName="request-modal-overlay"
    >
      <div className="request-modal-content"> 
        {message && (
          <MessageBox
            message={message}
            type={messageType}
            duration={5000}
            onClose={() => setMessage(null)}
          />
        )}

        <h2>
          Request Details
          <div style={{ float: 'right' }}>
            <div className="dropdown-container">
              <FaEllipsisV
                className="dropdown-icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div 
                className="dropdown-menu">
                  <button 
                  className='delete-req-btn' onClick={() => handleDeleteRequest(requestDetails?.req_id)}>
                    Delete Request
                  </button>
                  <button 
                  className='generate-req-btn' onClick={generatePDF}>Generate PDF</button>
                </div>
              )}
            </div>
          </div>
        </h2>
        {error ? (
          <p>Error: {error}</p>
        ) : requestDetails ? (
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
                      <td>{book.hours_due}</td>
                      <td>{book.penalty}</td>
                      <td>{book.book_status}</td>
                      <td>
                      <button 
                        onClick={() => updateBookStatus(book.book_id)} 
                        disabled={requestDetails.status === 'Pending' || book?.book_status === 'RETURNED'}
                      >
                        Return
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to renew this book?")) {
                            renewBook(book.book_id, requestDetails?.req_id, requestDetails?.borrower.borrower_type);
                          }
                        }} 
              
                        disabled={requestDetails.status === 'Pending' || book?.book_status === 'RETURNED'}
                      >
                        Renew
                      </button>

                      <button 
                        onClick={() => removeBook(book.book_id, requestDetails.req_id)} 
                        disabled={requestDetails.status === 'Pending' }
                      >
                        Remove
                      </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No books found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div>
              <button
                onClick={() => handleApprove(requestDetails?.req_id)}
                disabled={requestDetails?.status === 'Approved' || requestDetails?.status === 'Returned'}
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

              <button onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Modal>
  );
};

export default RequestModal;
