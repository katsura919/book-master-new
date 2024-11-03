import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Overview.css'; // Assuming you will add styles here

function Overview() {
  const [requests, setRequest] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    overdue: 0,
  });

  const [counts, setCounts] = useState({ todayCount: 0, yesterdayCount: 0, totalCount: 0});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/request-date');
        setCounts(response.data);
      } catch (error) {
        console.error('Error fetching request counts:', error);
      }
    };

    fetchCounts();
  }, []);


  const fetchRequestCounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/request-counts'); // Adjust the URL as needed
      setRequest(response.data);
    } catch (error) {
      console.error('Error fetching request counts:', error);
    }
  };

  useEffect(() => {
    fetchRequestCounts();
  }, []);

  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1>Welcome to Dashboard</h1>
      </header>
    

      <div className="request-count-card">
        <h2>Book Requests</h2>
        <div className="count-section">
          <div className="count-box">
            <h3>Pending</h3>
            <p>{requests.pending}</p>
          </div>
          <div className="count-box">
            <h3>Approved</h3>
            <p>{requests.approved}</p>
          </div>
          <div className="count-box">
            <h3>Overdue</h3>
            <p>{requests.rejected}</p>
          </div>
          <div className="count-box">
            <h3>Rejected</h3>
            <p>{requests.overdue}</p>
          </div>
        </div>
      </div>

      <div className="request-count-card">
        <h2>Book Request Counts</h2>
        <div className="count-section">
          <div className="count-box">
            <h3>Today</h3>
            <p>{counts.todayCount}</p>
          </div>
          <div className="count-box">
            <h3>Total</h3>
            <p>{counts.totalCount}</p>
          </div>
          <div className="count-box">
            <h3>Yesterday</h3>
            <p>{counts.yesterdayCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
