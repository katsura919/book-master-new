import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './TopBorrowedBooks.css'; // Import CSS for styling

const TopBorrowedBooks = () => {
  const apiBaseUrl = 'https://book-master-server.onrender.com'; 
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || ''; // Get the search query from URL
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle card click and navigate to book details
  const handleCardClick = (bookId) => {
    navigate(`/bookdetails/${bookId}`); // Navigate to the book details page
  };

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/top-borrowed-books`);
        setTopBooks(response.data);
      } catch (err) {
        setError('Error fetching top borrowed books');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);

  if (loading) return <p>Loading top borrowed books...</p>;
  if (error) return <p></p>;

  return (
    <div className="top-borrowed-books">
      <h2 className='top-borrowed-books-header'>TOP BORROWED BOOKS</h2>
      <div className="books-list">
        {topBooks.map((book) => (
          <div key={book.book_id} className="book-item"  onClick={() => handleCardClick(book.book_id)} style={{cursor: 'pointer'}}>
            <img
              src={`data:image/jpeg;base64,${book.cover_image}`}
              alt={book.title}
              className="book-cover"
            />
            <div className="book-info">
              <h3 className='top-book-title'> {book.title.length > 20 ? book.title.substring(0, 25) + '...' : book.title}</h3>
              <p>Borrowed {book.borrow_count} times</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default TopBorrowedBooks;
