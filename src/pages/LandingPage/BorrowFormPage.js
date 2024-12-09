import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import QRCodeModal from './component/QRCodeModal';
import BorrowingTermsModal from './component/BorrowingTermsModal';
import './BorrowFormPage.css';


function BookBorrowForm() {
  const apiBaseUrl = 'https://book-master-server.onrender.com'; 
  const frontBaseUrl = 'https://book-master-new.vercel.app'; 
  const [borrowerType, setBorrowerType] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [department, setDepartment] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const [isAccepted, setIsAccepted] = useState(false);


  const handleCheckboxChange = (e) => {
    setIsAccepted(e.target.checked);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [trackingURL, setTrackingURL] = useState('');

  console.log(trackingURL)
  // Fetch available books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/available-books`);
        setAvailableBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const departmentOptions = [
    { value: 'CEA', label: 'CEA' },
    { value: 'CITC', label: 'CITC' },
    { value: 'CSM', label: 'CSM' },
    { value: 'CSTE', label: 'CSTE' },
    { value: 'COT', label: 'COT' },
    { value: 'SHS', label: 'SHS' },
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
      const response = await axios.post(`${apiBaseUrl}/borrow-book`, {
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
        const qrURL = `${frontBaseUrl}/track-request/${requestId}`;
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
    label: `${book.title} - ${book.available_copies} available`,
  }));

  return (
    <div style={{marginTop: 100}}>
      <div>
        <form className="borrow-form" onSubmit={handleSubmit}>
          <h2 className='borrow-form-header'>REQUEST FORM</h2>
          {/* Borrower Form Fields */}
          <label>
            Borrower Type:
            <select className='borrower-type-selector' value={borrowerType} onChange={(e) => setBorrowerType(e.target.value)}>
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
              type="tel"
              value={contactNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) { // Allow only digits
                  setContactNumber(value);
                }
              }}
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
              required
            />
          </label>

          <h3>Books to Borrow:</h3>
          <Select
            isMulti
            options={bookOptions}
            onChange={handleBookSelect}
            value={selectedBooks}
            placeho
            lder="Search and select books"
          />

          <div className='terms-conditions-container'>
            <div>
              <input
                className='confirm-box'
                type="checkbox"
                checked={isAccepted}
                onChange={handleCheckboxChange}
              />
            </div>
            <div>
            I have read and accepted the{" "}
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={openModal}
            >
              terms and conditions
            </span>
          </div>
          </div>    

          <button 
          disabled={!isAccepted}
          className="submit-req-btn" 
          type="submit">
            Submit Request
          </button>
        </form>
        
        {/* Borrowing Terms Modal */}
        <BorrowingTermsModal isOpen={isModalOpen} onClose={closeModal} />

        {/* QRCodeModal Component */}
        <QRCodeModal 
          modalIsOpen={modalIsOpen} 
          setModalIsOpen={setModalIsOpen} 
          trackingURL={trackingURL} 
        />

      </div>
    </div>
  );
}

export default BookBorrowForm;
