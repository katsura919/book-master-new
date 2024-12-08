import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './BookDetailsPage.css'; // Import the CSS file

const BookDetailsPage = () => {
  const apiBaseUrl = 'http://localhost:5000'; 
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log(book)
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) {
        setError('Invalid book ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/book/${bookId}`);
        setBook(response.data);
      } catch (err) {
        setError('Could not fetch book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className='book-details-wrapper'>
      <div className="book-details-container">
        <div className="book-poster">
          {book.cover_image && (
            <img src={book.cover_image} alt={`${book.title} cover`} className="book-cover-image" />
          )}
        </div>
        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">Author: {book.author}</p>
          <p className="book-isbn">ISBN: {book.isbn}</p>
          <p className="book-isbn">Available Copies: {book.available_copies}</p>
          {book.description && <p className="book-description">Description: {book.description}</p>}
          
          {/* Display categories */}
          {book.categories && book.categories.length > 0 && (
            <div className="book-categories">
              <h3>Categories:</h3>
              <ul className="categories-list">
                {book.categories.map((category, index) => (
                  <li key={index} className="category-item">{category}</li>
                ))}
              </ul>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
