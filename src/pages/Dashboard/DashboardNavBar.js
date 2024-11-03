// src/pages/Dashboard/DashboardNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardNavBar.css'; // Optional: Add styles

const DashboardNavbar = () => {
    return (
        <nav className="dashboard-sidebar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/dashboard/bookreq">Requests</Link></li>
                <li><Link to="/dashboard/addbook">Books</Link></li>
            </ul>
        </nav>
    );
};

export default DashboardNavbar;
