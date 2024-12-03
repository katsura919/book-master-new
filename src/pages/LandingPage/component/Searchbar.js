import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Search = () => {
  const [query, setQuery] = useState(""); // Track search input
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?query=${query}`); // Redirect with search query
    }
  };

  return (
    <StyledWrapper>
      <div className="group">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="icon"
          onClick={() => query && navigate(`/search?query=${query}`)} // Search on icon click
        >
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input
          className="input"
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch} // Trigger search on Enter key
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .group {
    margin-top: 12px;
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    max-width: 400px;
  }

  .input {
    font-family: "Poppins", sans-serif;
    width: 400px;
    height: 40px;
    line-height: 28px;
    padding: 0 1rem;
    padding-left: 2.5rem;
    border: 2px solid transparent;
    border-radius: 8px;
    outline: none;
    background-color: #f3f3f4;
    color: #0d0c22;
    transition: 0.3s ease;
  }

  .input::placeholder {
    color: #9e9ea7;
  }

  .input:focus,
  input:hover {
    outline: none;
    border-color: rgba(0, 48, 73, 0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(0 48 73 / 10%);
  }

  .icon {
    position: absolute;
    top: 0.8rem;
    left: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }

  /* Hide input and only show the icon on mobile */
  @media (max-width: 768px) {
    .input {
      display: none;
    }
    .icon {
      fill: #0d0c22;
    }
  }
`;

export default Search;