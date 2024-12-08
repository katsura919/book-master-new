// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/authSlice';
import logo from '../../../assets/logo.png'
import './Navbar.css'; 

import Search from './Searchbar';

const Navbar = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar">
            <div>
                <Link className="navbar-link" to="/">
                    <img
                        src= {logo}
                        alt="Business Illustration"
                        className="logo"
                    />
                </Link>
            </div>
            <div><Search className="search-bar"/></div>
            
            <ul className="navbar-list">
                
                <li className="navbar-item">
                    <Link className="navbar-link" to="/">Home</Link>
                </li>
                <li className="navbar-item">
                    <Link className="navbar-link" to="/allbooks">Books</Link>
                </li>
                
                {isAuthenticated ? (
                    <>
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/dashboard" >Dashboard</Link>
                        </li>

                        <li className="navbar-item">
                            <Link className="navbar-link" to="/" onClick={handleLogout}>Logout</Link>
                        </li>
                    </>
                    
                ) : (
                    <>
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/login">Login</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
