import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import QRCodeModal from './component/QRCodeModal';
import './BorrowFormPage.css';


function BookBorrowForm() {
  const [borrowerType, setBorrowerType] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [department, setDepartment] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [trackingURL, setTrackingURL] = useState('');

  console.log(trackingURL)
  // Fetch available books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/available-books');
        setAvailableBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const departmentOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Biology', label: 'Biology' },
  ];

  const getBorrowLimit = (type) => {
    switch (type) {
      case 'student':
        return { maxBooks: 3, dueDays: 7 };
      case 'faculty':
        return { maxBooks: 10, dueDays: 120 };
      case 'employee':
        return { maxBooks: 10, dueDays: 7 };
      default:
        return { maxBooks: 0, dueDays: 0 };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { maxBooks } = getBorrowLimit(borrowerType);

    if (selectedBooks.length > maxBooks) {
      alert(`Exceeded the book limit! ${borrowerType}s can only borrow ${maxBooks} books.`);
      return;
    }

    if (!studentId || !firstName || !lastName || !email || !contactNumber || !department) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/borrow-book', {
        studentId,
        firstName,
        lastName, 
        email,
        contactNumber,
        borrowerType,
        department: department.value,
        books: selectedBooks,
      });

      if (response.status === 201) {
        const { requestId } = response.data; // Get the request ID
        const qrURL = `http://localhost:3000/track-request/${requestId}`;
        setTrackingURL(qrURL);

        // Open the modal with the QR code
        setModalIsOpen(true);

        // Reset the form
        resetForm();
      } else {
        alert('Failed to borrow books.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
      alert('An error occurred while borrowing books.');
    }
  };

  const resetForm = () => {
    setStudentId('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setContactNumber('');
    setSelectedBooks([]);
    setDepartment(null);
  };

  const handleBookSelect = (selectedOptions) => {
    setSelectedBooks(selectedOptions || []);
  };

  const bookOptions = availableBooks.map((book) => ({
    value: book.book_id,
    label: `${book.title} (ISBN: ${book.isbn}) - ${book.available_copies} available`,
  }));

  return (
    <div>
      <form className="borrow-form" onSubmit={handleSubmit}>
        <h2>Book Check-Out Form</h2>
        {/* Borrower Form Fields */}
        <label>
          Borrower Type:
          <select value={borrowerType} onChange={(e) => setBorrowerType(e.target.value)}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="employee">Employee</option>
          </select>
        </label>
        <label>
          ID Number:
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </label>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contact Number:
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </label>
        <label>
          Department:
          <Select
            options={departmentOptions}
            onChange={setDepartment}
            value={department}
            placeholder="Select Department"
          />
        </label>
        <h3>Books to Borrow:</h3>
        <Select
          isMulti
          options={bookOptions}
          onChange={handleBookSelect}
          value={selectedBooks}
          placeholder="Search and select books"
        />
        <button className="submit-req-btn" type="submit">
          Borrow Books
        </button>
      </form>

      {/* QRCodeModal Component */}
      <QRCodeModal 
        modalIsOpen={modalIsOpen} 
        setModalIsOpen={setModalIsOpen} 
        trackingURL={trackingURL} 
      />

    </div>
  );
}

export default BookBorrowForm;
