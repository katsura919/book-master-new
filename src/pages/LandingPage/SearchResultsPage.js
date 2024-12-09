import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './component/Footer';
import './SearchResult.css';

const ENTRIES_PER_PAGE = 2; // Number of entries per page

const SearchResults = () => {
  const apiBaseUrl = 'https://book-master-server.onrender.com';
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]); // Store search results

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || ''; // Get the search query from URL
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch search results from the backend
  const fetchBooks = async () => {
    try {
      setLoading(true); 
      setError('');

      const response = await axios.get(`${apiBaseUrl}/search`, {
        params: {
          query: query,
        },
      });

      setFilteredRequests(response.data.results);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch books whenever the query changes
  useEffect(() => {
    fetchBooks();
  }, [query]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequests.length / ENTRIES_PER_PAGE);
  const indexOfLastRequest = currentPage * ENTRIES_PER_PAGE;
  const indexOfFirstRequest = indexOfLastRequest - ENTRIES_PER_PAGE;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  // Function to handle card click and navigate to book details
  const handleCardClick = (bookId) => {
    navigate(`/bookdetails/${bookId}`); // Navigate to the book details page
  };

  return (
    <div>
    <StyledWrapper>
      <div className='search-page-body'>
      <h1 className='search-header'>Search Results for "{query}"</h1>

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Search Results */}
      <div className="book-cards">
        {currentRequests.map((book) => (
          <Card key={book.book_id} onClick={() => handleCardClick(book.book_id)}>
            {book.cover_image && (
              <img
                src={`data:image/jpeg;base64,${book.cover_image}`}
                alt={`${book.title} cover`}
                className="cover-image"
              />
            )}
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>Available Copies: {book.available_copies}</p>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className='search-pagination'>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage((prev) => prev + 1)} 
          disabled={currentPage === totalPages || totalPages === 0} // Disable button if there's no next page
        >
          Next
        </button>
      </div>

      
      </div>
    </StyledWrapper>
    <Footer/>
    </div>
  );
};

// Styled Components for Card Layout
const StyledWrapper = styled.div`
  padding: 20px;
  margin-top: 50px;

  .book-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 200px;
  text-align: center;
  background-color: #f9f9f9;
  cursor: pointer; // Change cursor to pointer to indicate clickable card

  .cover-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
  }

  h3 {
    font-size: 1.2em;
    margin: 10px 0;
  }

  p {
    margin: 5px 0;
  }
`;

export default SearchResults;
