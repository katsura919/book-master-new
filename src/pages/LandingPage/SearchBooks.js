import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const SearchBooks = () => {
  const [query, setQuery] = useState(''); // Search input
  const [books, setBooks] = useState([]); // Search results
  const [page, setPage] = useState(1); // Current page
  const [limit] = useState(5); // Results per page

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch search results from the backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('http://localhost:5000/search', {
        params: {
          query: query || '', // If query is empty, search all books
          page,
          limit,
        },
      });

      setBooks(response.data.results);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch books whenever the query or page changes
  useEffect(() => {
    fetchBooks();
  }, [query, page]);

  return (
    <StyledWrapper>
      <h1>Search Books</h1>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Enter book title, author, or ISBN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={() => setPage(1)}>Search</button>
      </div>

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Search Results */}
      <div className="book-cards">
        {books.map((book) => (
          <Card key={book.book_id}>
            {book.cover_image && (
              <img
                src={require('./Navbar/sample.jpg')}
                alt={`${book.title} cover`}
                className="cover-image"
              />
            )}
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Available Copies: {book.available_copies}</p>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </StyledWrapper>
  );
};

// Styled Components for Card Layout
const StyledWrapper = styled.div`
  padding: 20px;

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

export default SearchBooks;
