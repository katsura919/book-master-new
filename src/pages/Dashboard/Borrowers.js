import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Borrowers.css'; // Custom styles

const Borrowers = () => {
  const apiBaseUrl = 'http://localhost:5000';
  const [borrowers, setBorrowers] = useState([]);
  const [totalBorrowers, setTotalBorrowers] = useState(null);
  const [borrowerTypes, setBorrowerTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);  // Set the items per page

  useEffect(() => {
    // Fetch borrowers data
    const fetchBorrowers = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/borrowers`); // Update with your API endpoint
          
          // Log the response to inspect its structure
          console.log('API Response:', response);
      
          // Assuming the actual data is inside `response.data.borrowers` or similar
          if (Array.isArray(response.data)) {
            setBorrowers(response.data);
          } else {
            console.error('Unexpected response format', response.data);
          }
        } catch (error) {
          console.error('Error fetching borrowers:', error);
        }
      };
      

         // Fetch total count of borrowers
        axios
        .get(`${apiBaseUrl}/api/borrowers/count`)
        .then((response) => setTotalBorrowers(response.data.total_borrowers))
        .catch((error) => console.error("Error fetching total borrowers:", error));

      // Fetch borrower type distribution
      axios
        .get(`${apiBaseUrl}/api/borrowers/type-distribution`)
        .then((response) => setBorrowerTypes(response.data.borrower_types))
        .catch((error) => console.error("Error fetching borrower types:", error));
    fetchBorrowers();
  }, []);

  // Pagination: calculate total pages
  const totalPages = Math.ceil(borrowers.length / itemsPerPage);

  // Slice the borrowers array to get the current page's items
  const currentItems = borrowers.slice(
    (currentPage - 1) * itemsPerPage,  // Start index for the current page
    currentPage * itemsPerPage         // End index for the current page
  );

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="borrowers-container">
      <h1 className="borrowers-header">Borrowers List</h1>

      <div className="borrower-analytics-container">
        {/* Total Borrowers Card */}
        <div className="borrower-card total-borrowers-card">
          <h3>Total Borrowers</h3>
          <div className="borrower-count">{totalBorrowers}</div>
        </div>

        {/* Borrower Type Distribution Cards */}
        <div className="borrower-type-list ">
          {borrowerTypes.map((type) => (
            <div
              key={type.borrower_type}
              className={`borrower-type-item ${type.borrower_type}-card`} // Add dynamic class based on borrower type
            >
              <div className={`borrower-type-name ${type.borrower_type} `}>
                {type.borrower_type.charAt(0).toUpperCase() + type.borrower_type.slice(1)}
              </div>
              <div className="borrower-type-count">{type.count} Borrowers</div>
            </div>
          ))}
        </div>
      </div>

      <table className="borrowers-table styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((borrower) => (
            <tr key={borrower.borrower_id}>
              <td>{borrower.borrower_id}</td>
              <td>{borrower.first_name}</td>
              <td>{borrower.last_name}</td>
              <td>{borrower.department || 'N/A'}</td>
              <td>{borrower.email}</td>
              <td>{borrower.contact_number}</td>
              <td className={`borrower-type ${borrower.borrower_type.toLowerCase()}`}>
                {borrower.borrower_type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="pagination">
        <button 
          className="pagination-btn" 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button 
          className="pagination-btn" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Borrowers;
