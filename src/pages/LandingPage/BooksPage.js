import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./BooksPage.css"; // Include a CSS file for styling

const AllBooks = () => {
  const apiBaseUrl = 'http://localhost:5000'; 
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Number of books per page
  const navigate = useNavigate(); // Initialize useNavigate
  // Fetch books from the server
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/all-books`, {
        params: {
          category_id: selectedCategory?.value || null,
          page: currentPage,
          limit,
        },
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Fetch categories for the filter
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/categories`);
      const options = response.data.map((category) => ({
        value: category.category_id,
        label: category.name,
      }));
      setCategories(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCardClick = (bookId) => {
    navigate(`/bookdetails/${bookId}`); // Navigate to the book details page
  };

  return (
    <div className="books-page">
      <header>
        <h1>Books</h1>
      </header>
      
      <header>
        <h4>Category</h4>
      </header>
      {/* Category Filter */}
      <div style={{ marginBottom: "20px", width: "300px" }}>
        <Select
          options={categories}
          onChange={handleCategoryChange}
          value={selectedCategory}
          placeholder="Filter by category"
          isClearable
        />
      </div>

      {/* Books Cards */}
      <div className="book-cards">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              className="book-card"
              key={book.book_id}
              onClick={() => handleCardClick(book.book_id)}
            >
              {book.cover_image && (
                <img
                  src={`data:image/jpeg;base64,${book.cover_image}`}
                  alt={`${book.title} cover`}
                  className="cover-image"
                />
              )}
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <p>Available Copies: {book.available_copies}</p>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AllBooks;
