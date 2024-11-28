import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookReq.css';
import RequestModal from './Modals/RequestModal'; // Import the Modal component

const ENTRIES_PER_PAGE = 10;

function BookReq() {
  const [bookRequests, setBookRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchType, setFetchType] = useState('all-req');
  const [selectedOption, setSelectedOption] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchBookRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/${fetchType}`);
      setBookRequests(response.data);
    } catch (error) {
      console.error('Error fetching book requests:', error);
    }
  };

  useEffect(() => {
    fetchBookRequests();
  }, [fetchType]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredRequests = bookRequests.filter(request =>
    `${request.borrower.first_name} ${request.borrower.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / ENTRIES_PER_PAGE);
  const indexOfLastRequest = currentPage * ENTRIES_PER_PAGE;
  const indexOfFirstRequest = indexOfLastRequest - ENTRIES_PER_PAGE;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  }
  
  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  
  const [requests, setRequest] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    overdue: 0,
  });

  const [counts, setCounts] = useState({ todayCount: 0, yesterdayCount: 0, totalCount: 0});

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
    <div className="home-container">
      
      <div>
        <header className="content-header">
          <h1>Requests</h1>
        </header>
      </div>


      <div className='first-layer'>
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

      <input
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="radio-inputs">
        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="All"
            checked={selectedOption === "All"}
            onChange={(e) => {
              handleChange(e);
              setFetchType('all-req');
            }}
          />
          <span className="name">All</span>
        </label>

        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="Pending"
            checked={selectedOption === "Pending"}
            onChange={(e) => {
              handleChange(e);
              setFetchType('pending-req');
            }}
          />
          <span className="name">Pending</span>
        </label>

        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="Approved"
            checked={selectedOption === "Approved"}
            onChange={(e) => {
              handleChange(e);
              setFetchType('approved-req');
            }}
          />
          <span className="name">Approved</span>
        </label>

        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="Rejected"
            checked={selectedOption === "Rejected"}
            onChange={(e) => {
              handleChange(e);
              setFetchType('rejected-req');
            }}
          />
          <span className="name">Rejected</span>
        </label>

        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="Overdue"
            checked={selectedOption === "Overdue"}
            onChange={(e) => {
              handleChange(e);
              setFetchType('overdue-req');
            }}
          />
          <span className="name">Overdue</span>
        </label>

        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="Return"
            checked={selectedOption === "Return"}
            onChange={(e) => {
              handleChange(e);
              setFetchType('return-req');
            }}
          />
          <span className="name">Returned</span>
        </label>
      </div>

      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Request Created</th>
              <th>Approval Date</th>
              <th>Due Date</th>
              <th>Hours Due</th>
              <th>Penalty</th>
          
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr key={request.req_id}>
                <td onClick={() => openModal(request)} style={{ cursor: 'pointer', color: 'blue' }}>
                  {request.req_id}
                </td>
                <td>{`${request.borrower.first_name} ${request.borrower.last_name}`}</td>
                <td>{request.borrower.borrower_type}</td>
                <td>{request.status}</td>
                <td>{request.req_created}</td>
                <td>{request.req_approve || 'N/A'}</td>
                <td>{request.books.length > 0 ? request.books[0].due_date : 'N/A'}</td>
                <td>{request.books.length > 0 ? request.books[0].hours_due : 'N/A'} hrs</td>
                <td>₱ {request.books.length > 0 ? request.books[0].penalty : 'N/A'}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button className='nav-btn' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className='nav-btn' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || currentRequests.length === 0}>
          Next
        </button>
      </div>
      {/* Modal for request details */}
      <RequestModal 
      isOpen={isModalOpen} 
      onClose={closeModal} 
      requestID={selectedRequest?.req_id}
      refreshList={fetchBookRequests} // Pass the refresh function
      />
    </div>
  );
}

export default BookReq;
