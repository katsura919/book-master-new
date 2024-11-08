// components/EditBookModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditBookModal.css";

const EditBookModal = ({ isOpen, onClose, book, onSave }) => {
  const [bookData, setBookData] = useState(book);
  const [isLoading, setIsLoading] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    const fetchBookData = async () => {
      if (isOpen && book?.book_id) {
        try {
          const response = await axios.get(`http://localhost:5000/book/${book.book_id}`);
          setBookData(response.data);
          setCoverImagePreview(response.data.cover_image); // Set initial cover image preview
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching book data:", error);
          setIsLoading(false);
        }
      }
    };

    fetchBookData();
  }, [book, isOpen]);

  if (!isOpen || !bookData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Check if the file is an image
    if (file && !file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      e.target.value = ''; // Clear the input
    } else {
      setErrorMessage(''); // Clear error message if file is valid
      setCoverImage(file);  // Set the selected image
      setCoverImagePreview(URL.createObjectURL(file));  // Display image preview
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("isbn", bookData.isbn);
    formData.append("author", bookData.author);
    formData.append("total_copies", bookData.total_copies);
    formData.append("available_copies", bookData.available_copies);
    if (coverImage) formData.append("cover_image", coverImage); // Include image file if available

    try {
      await axios.put(`http://localhost:5000/book/${bookData.book_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSave(bookData); // Pass updated data back to parent component
      onClose();
    } catch (error) {
      console.error("Error updating book data:", error);
    }
  };

  if (isLoading) return <div className="modal-overlay"><div className="modal-content">Loading...</div></div>;


  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Book</h2>
        <label>
          Title:
          <input type="text" name="title" value={bookData.title || ""} onChange={handleChange} />
        </label>
        <label>
          ISBN:
          <input type="text" name="isbn" value={bookData.isbn || ""} onChange={handleChange} />
        </label>
        <label>
          Author:
          <input type="text" name="author" value={bookData.author || ""} onChange={handleChange} />
        </label>
        <label>
          Total Copies:
          <input type="number" name="total_copies" value={bookData.total_copies || 0} onChange={handleChange} />
        </label>
        <label>
          Available Copies:
          <input type="number" name="available_copies" value={bookData.available_copies || 0} onChange={handleChange} />
        </label>
        <label>
          Cover Image:
          <input
        type="file"
        name="cover_image"
        accept="image/*"
        onChange={handleImageChange}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}  {/* Error message */}
      <img src={coverImagePreview} alt="Cover Preview" style={{ maxWidth: '200px' }} /> {/* Image Preview */}
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditBookModal;