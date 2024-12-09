import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import MessageBox from "../../../components/MessageBox";
const Books = () => {
  const apiBaseUrl = 'https://book-master-server.onrender.com';
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); 
  const initialBookData = {
    title: "",
    isbn: "",
    author: "",
    description: "", // Add description field to book data
    total_copies: "",
    available_copies: "",
  };

  const [bookData, setBookData] = useState(initialBookData);
  const [coverImage, setCoverImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // For error handling
  const [categories, setCategories] = useState([]); // Available categories
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/categories`); // Adjust endpoint as needed
        const options = response.data.map((category) => ({
          value: category.category_id,
          label: category.name,
        }));
        setCategories(options); // Format categories for react-select
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Check if the file is an image
    if (file && !file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file."); // Set error message
      e.target.value = ""; // Clear the file input
      setCoverImage(null); // Reset cover image state
    } else {
      setErrorMessage(""); // Clear error message if file is valid
      setCoverImage(file); // Set the cover image
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions); // Update selected categories
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      formData.append(key, bookData[key]);
    });
    if (coverImage) {
      formData.append("cover_image", coverImage);
    }

    // Append selected categories as an array of IDs
    const categoryIds = selectedCategories.map((category) => category.value);
    formData.append("categories", JSON.stringify(categoryIds));

    try {
      const response = await axios.post(`${apiBaseUrl}/books`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage('Book added successfully!');
      setMessageType('success');

      // Reset fields after successful submission
      setBookData(initialBookData);
      setCoverImage(null); // Reset cover image
      setSelectedCategories([]); // Reset categories
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book");
    }
  };

  return (
    <div className="add-book-wrapper">
      {message && (
          <MessageBox
            message={message}
            type={messageType}
            duration={2000}
            onClose={() => setMessage(null)}
          />
        )}

      <form onSubmit={handleSubmit}>
        <div>
          <header className="content-header">
            <h1>Add Books</h1>
          </header>
        </div>

        <input
          className="add-book-input"
          type="text"
          name="title"
          placeholder="Title"
          value={bookData.title}
          onChange={handleChange}
          required
        />

        <input
          className="add-book-input"
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={bookData.isbn}
          onChange={handleChange}
          required
        />

        <input
          className="add-book-input"
          type="text"
          name="author"
          placeholder="Author"
          value={bookData.author}
          onChange={handleChange}
          required
        />

        <textarea
          className="add-book-input"
          name="description"
          placeholder="Description"
          value={bookData.description}
          onChange={handleChange}
          style={{ width: 870, minHeight: "50px",  overflow: "hidden" }} // Prevent resizing but allow auto expansion
          required
        />

        <input
          className="add-book-input"
          type="number"
          name="total_copies"
          placeholder="Total Copies"
          value={bookData.total_copies}
          onChange={handleChange}
          required
        />

        <input  
          className="add-book-input"
          type="number"
          name="available_copies"
          placeholder="Available Copies"
          value={bookData.available_copies}
          onChange={handleChange}
          required
        />

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <input
          className="add-book-input"
          type="file"
          name="cover_image"
          accept="image/*"
          onChange={handleImageChange}
        />
    

        {/* Category selection with react-select */}
        <div>
          <label>Select Categories:</label>
          <Select
            isMulti
            options={categories} // Pass formatted category options
            onChange={handleCategoryChange} // Handle selection
            value={selectedCategories} // Selected categories
            placeholder="Search and select categories"
          />
        </div>

        <button className="add-books-btn" type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default Books;
