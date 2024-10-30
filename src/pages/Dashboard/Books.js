import React, { useState, useEffect } from "react";
import axios from "axios";
import './Books.css';
import AddBookForm from './components/AddBooksForm';
import AddBookModal from "./components/AddBookModal";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Number of books per page

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/book-list'); // Adjust the URL as needed
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Calculate current books to display
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="book-container">
      <h1 className="books-header">Books</h1>
      <button onClick={handleOpenModal}>Add Books</button>
      <AddBookModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddBookForm />
      </AddBookModal>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Title</th>
              <th>ISBN</th>
              <th>Author</th>
              <th>Total Copies</th>
              <th>Available Copies</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map(book => (
              <tr key={book.book_id}>
                <td>{book.book_id}</td>
                <td>{book.title}</td>
                <td>{book.isbn}</td>
                <td>{book.author}</td>
                <td>{book.total_copies}</td>
                <td>{book.available_copies}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Books;
