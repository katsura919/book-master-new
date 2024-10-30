import React, { useState } from "react";
import axios from "axios";

const Books = () => {
  const initialBookData = {
    title: "",
    isbn: "",
    author: "",
    total_copies: "",
    available_copies: "",
  };
  
  const [bookData, setBookData] = useState(initialBookData);
  const [coverImage, setCoverImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
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

    try {
      const response = await axios.post("http://localhost:5000/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Book added successfully!");

      // Reset fields after successful submission
      setBookData(initialBookData);
      setCoverImage(null); // Reset cover image
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book");
    }
  };

  return (
    <div className="add-book-wrapper">
      <form onSubmit={handleSubmit}>
        <div>
          <header className="content-header">
            <h1>Add Books</h1>
          </header>
        </div>
        <input type="text" name="title" placeholder="Title" value={bookData.title} onChange={handleChange} required />
        <input type="text" name="isbn" placeholder="ISBN" value={bookData.isbn} onChange={handleChange} required />
        <input type="text" name="author" placeholder="Author" value={bookData.author} onChange={handleChange} required />
        <input type="number" name="total_copies" placeholder="Total Copies" value={bookData.total_copies} onChange={handleChange} required />
        <input type="number" name="available_copies" placeholder="Available Copies" value={bookData.available_copies} onChange={handleChange} required />
        <input type="file" name="cover_image" onChange={handleImageChange} />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default Books;
