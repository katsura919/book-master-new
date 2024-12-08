import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TrackingPage.css';

function TrackingPage() {
  const apiBaseUrl = 'http://localhost:5000';
  const { req_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the tracking data
    const fetchTrackingData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/track-request/${req_id}`);
        setData(response.data); // API returns { borrower_name, request_status, books }
      } catch (err) {
        console.error('Error fetching tracking data:', err.message);
        setError('Unable to fetch the tracking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [req_id]);

  if (loading) {
    return <div className="tracking-page-container"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="tracking-page-container"><p className="tracking-page-error-message">{error}</p></div>;
  }

  return (
    <div className='tracking-page-wrapper'>
      <div className="tracking-page-container">
        <h1>Request Details</h1>
        <p><strong>Borrower:</strong> {data.borrower_name}</p>
        <p><strong>Request Status:</strong> {data.request_status}</p>
        
        <h2>Books Borrowed:</h2>
        <table className="tracking-page-books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due Date</th>
              <th>Hours Due</th>
              <th>Penalty</th>
              <th>Book Status</th>
            </tr>
          </thead>
          <tbody>
            {data.books.map((book, index) => (
              <tr key={index}>
                <td>{book.title}</td>
                <td>{book.due_date || 'N/A'}</td>
                <td>{book.hours_due || 'N/A'}</td>
                <td>{book.penalty || 0} php</td>
                <td>{book.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrackingPage;
