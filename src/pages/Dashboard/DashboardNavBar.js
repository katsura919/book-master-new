// src/pages/Dashboard/DashboardNavbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.png';
import './DashboardNavBar.css';

const DashboardNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="dashboard-navbar-container">
            <div className="dashboard-navbar">
                <div className="dashboard-logo-wrapper">
                    <Link to="/hero">
                        <img src={logo} alt="Logo" className="dashboard-logo" />
                    </Link>
                </div>

                {/* Hamburger Menu Button */}
                <div className="hamburger" onClick={toggleMenu}>
                    &#9776; {/* Hamburger icon */}
                </div>

                {/* Navigation Links */}
                <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
                    <ul>
                        <li>
                            <Link to="/dashboard" className="nav-link">
                              
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/bookreq" className="nav-link">
                         
                                <span>Requests</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/addbook" className="nav-link">
                           
                                <span>Books</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/borrowers" className="nav-link">
                             
                                <span>Borrowers</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;
