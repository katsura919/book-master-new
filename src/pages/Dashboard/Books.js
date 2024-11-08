import React, { useState, useEffect } from "react";
import axios from "axios";
import './Books.css';
import AddBookForm from './Modals/AddBooksForm';
import AddBookModal from "./Modals/AddBookModal";
import EditBookModal from "./Modals/EditBookModal";
import BookRequestsModal from "./Modals/BookRequestsModal";  // Import the updated modal

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/book-list");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRequestsModalOpen, setRequestsModalOpen] = useState(false);  // Track requests modal visibility
  const [bookIdForRequests, setBookIdForRequests] = useState(null);  // Track the selected book ID for requests

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenEditModal = (book) => {
    setSelectedBook(book);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedBook(null);
  };

  const handleOpenRequestsModal = (bookId) => {
    setBookIdForRequests(bookId);  // Set the selected book ID
    setRequestsModalOpen(true);     // Open the requests modal
  };

  const handleCloseRequestsModal = () => setRequestsModalOpen(false);

  const handleSaveEdit = async (updatedBook) => {
    try {
      await axios.put(`http://localhost:5000/book/${updatedBook.book_id}`, updatedBook);
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.book_id === updatedBook.book_id ? updatedBook : book))
      );
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  
  return (
    <div className="book-container">
      <h1 className="books-header">Books</h1>
      <button onClick={handleOpenAddModal}>Add Books</button>
      <AddBookModal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
        <AddBookForm />
      </AddBookModal>

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        book={selectedBook}
        onSave={handleSaveEdit}
      />

      <BookRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={handleCloseRequestsModal}
        bookId={bookIdForRequests}  // Pass the selected book ID to the modal
      />

      <div>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Title</th>
              <th>ISBN</th>
              <th>Author</th>
              <th>Total Copies</th>
              <th>Available Copies</th>
              <th>Show Requests</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.book_id}>
                <td >
                  {book.book_id}
                </td>
                <td onClick={() => handleOpenEditModal(book)} style={{ cursor: "pointer", color: "blue" }}>{book.title}</td>
                <td>{book.isbn}</td>
                <td>{book.author}</td>
                <td>{book.total_copies}</td>
                <td>{book.available_copies}</td>
                <td>
                  <button onClick={() => handleOpenRequestsModal(book.book_id)}>
                    Show Requests
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
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
