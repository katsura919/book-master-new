import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import CheckOutButton from './component/CheckOutButton';

const LandingPage = () => {
    const navigate = useNavigate();


      
  return (
        <div className="landing-container">
    
            <header className="landing-header">
                <h1>Welcome to Book Master</h1>
                <p>Simplifying the way you borrow.</p>
                <CheckOutButton/>
            </header>

            <footer className="landing-footer">
                <p>© 2024 Our Company. All rights reserved.</p>
            </footer>
        </div>
  )
};

export default LandingPage;
