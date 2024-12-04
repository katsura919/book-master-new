import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookReq.css';
import RequestModal from './Modals/RequestModal'; // Import the Modal component
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Assuming your root element has id 'root'
const ENTRIES_PER_PAGE = 10;

function BookReq() {
  const [bookRequests, setBookRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchType, setFetchType] = useState('all-req');
  const [selectedOption, setSelectedOption] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to format time in hh:mm am/pm format
  const formatTime = (date) => {
   let hours = date.getHours();
   let minutes = date.getMinutes();
   const ampm = hours >= 12 ? 'pm' : 'am';
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? '0' + minutes : minutes; // add leading zero for minutes
   return `${hours}:${minutes} ${ampm}`;
 };
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
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
    }, 60000); // Update every 60 seconds

    // Initialize with the current time
    setCurrentTime(formatTime(new Date()));

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
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
    <div className="bookreq-container">
      
      <div>
        <header className="bookreq-header">
          <h1>Book Requests</h1>
        </header>
      </div>
   
      {/* Cards Section */}
      <div className="bookreq-cards-section">
        <div className="bookreq-card card-pending">
          <div className="bookreq-card-header">
            <div className="bookreq-card-value">{requests.pending}</div>
            <div className="bookreq-card-title">Pending</div>
          </div>
          <div className="bookreq-card-footer">
            <div className="bookreq-info">
              <div className="bookreq-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>

        <div className="bookreq-card card-approved">
          <div className="bookreq-card-header">
            <div className="bookreq-card-value">{requests.approved}</div>
            <div className="bookreq-card-title">Approved</div>
          </div>
          <div className="bookreq-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>

        <div className="bookreq-card card-overdue">
          <div className="bookreq-card-header">
            <div className="bookreq-card-value">{requests.overdue}</div>
            <div className="bookreq-card-title">Overdue</div>
          </div>
          <div className="bookreq-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>

        <div className="bookreq-card card-downloads">
          <div className="bookreq-card-header">
            <div className="bookreq-card-value">{requests.rejected}</div>
            <div className="bookreq-card-title">Rejected</div>
          </div>
          <div className="bookreq-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        className='bookreq-search'
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* Type Selector */}
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
        <table className="dashboard-table styled-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Name</th>
              <th>ID Number</th>
              <th>Type</th>
              <th>Status</th>
              <th>Approval Date</th>
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
                <td>{request.borrower_id}</td>
                <td className={`bookreq-status`}>
                   <div className={`bookreq-status-text ${request.status.toLowerCase()}`}>{request.status}</div>
                </td> 
                <td>{request.req_approve || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      <div className="bookreq-pagination">
        <button className='bookreq-nav-btn' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className='bookreq-nav-btn' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || currentRequests.length === 0}>
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
