// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import './Navbar.css'; 

import Search from './component/Search';

const Navbar = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar">
            <Search className="search-bar"/>
            <ul className="navbar-list">
                
                <li className="navbar-item">
                    <Link className="navbar-link" to="/">Home</Link>
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
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
