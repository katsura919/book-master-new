import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) {
        setError('Invalid book ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/books/${bookId}`);
        setBook(response.data);
      } catch (err) {
        setError('Could not fetch book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      {book.cover_image && (
        <img src={`data:image/jpeg;base64,${book.cover_image}`} alt={`${book.title} cover`} />
      )}
      <p>Author: {book.author}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Description: {book.description}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default BookDetails;
