import React, { useState, useEffect } from "react";
import axios from "axios";
import './Books.css';
import AddBookForm from './Modals/AddBooksForm';
import AddBookModal from "./Modals/AddBookModal";
import EditBookModal from "./Modals/EditBookModal";
import BookRequestsModal from "./Modals/BookRequestsModal";  // Import the updated modal

const Books = () => {
  const [totalBooks, setTotalBooks] = useState(null);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [topBooks, setTopBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const itemsPerPage = 5;
  console.log(totalBooks);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/book-list");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  
  const [currentTime, setCurrentTime] = useState('');

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch the stats using Promise.all for concurrent API calls
        const [availableResponse, borrowedResponse, totalBooksResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/total-available-books'),
          axios.get('http://localhost:5000/api/total-borrowed-books'),
          axios.get('http://localhost:5000/api/total-books')  // Added new API for total books
        ]);
    
        // Set state for available and borrowed books
        setAvailableBooks(availableResponse.data.totalAvailableBooks);
        setBorrowedBooks(borrowedResponse.data.totalBorrowedBooks);
        setTotalBooks(totalBooksResponse.data.totalBooks);

      } catch (error) {
        console.error('Error fetching book stats:', error);
      }
    };
    
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/top-borrowed-books');
        setTopBooks(response.data);
      } catch (error) {
        console.error('Error fetching top borrowed books:', error);
      }
    };

    fetchTopBooks();
    fetchStats();
    fetchBooks();

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
    }, 60000); // Update every 60 seconds

    // Initialize with the current time
    setCurrentTime(formatTime(new Date()));

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);

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

  const handleDelete = () => {
    fetchBooks();// Refresh the book list after deleting a book
    
  };
  
  return (
    <div className="book-container">
      <h1 className="books-header">Books</h1>

      <div className="cards-section">
        <div className="summary-card card-views">
          <div className="summary-card-header">
            <div className="summary-card-value">{totalBooks}</div>
            <div className="summary-card-title">Total Books</div>
          </div>
          <div className="summary-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>

        <div className="summary-card card-tasks">
          <div className="summary-card-header">
            <div className="summary-card-value">{availableBooks}</div>
            <div className="summary-card-title">Available Copies</div>
          </div>
          <div className="summary-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>

        <div className="summary-card card-downloads">
          <div className="summary-card-header">
            <div className="summary-card-value">{borrowedBooks}</div>
            <div className="summary-card-title">Borrowed Copies</div>
          </div>
          <div className="summary-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleOpenAddModal}>Add Books</button>
      <AddBookModal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
        <AddBookForm />
      </AddBookModal>

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        book={selectedBook}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
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


      
      <div className="container">
      <div className="table-container">
    <div className="table-responsive">
      <table className="books-table styled-table">
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
              <td>{book.book_id}</td>
              <td onClick={() => handleOpenEditModal(book)} style={{ cursor: "pointer", color: "blue" }}>
                {book.title}
              </td>
              <td>{book.isbn}</td>
              <td>{book.author}</td>
              <td>{book.total_copies}</td>
              <td className={`availability ${book.available_copies > 0 ? "available" : "unavailable"}`}>
                {book.available_copies}
              </td>
              <td>
                <button className="requests-btn" onClick={() => handleOpenRequestsModal(book.book_id)}>
                  Show Requests
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

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

  <div className="top-books-container">
    <div className="top-books-card">
      <div className="top-books-card-header">Top 5 Borrowed Books</div>
      <div className="top-books-list">
        {topBooks.map((book, index) => (
          <div key={book.book_id} className="top-book-item">
            <div className="top-book-rank">{index + 1}</div>
            <img
              src={`data:image/jpeg;base64,${book.cover_image}`}
              alt={book.title}
              className="top-book-image"
            />
            <div className="top-book-details">
              <div className="top-book-title">{book.title}</div>
              <div className="top-book-borrow-count">{book.borrow_count} Borrows</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>




    </div>
  );
};

export default Books;
