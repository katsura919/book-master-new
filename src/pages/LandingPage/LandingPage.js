import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import CheckOutButton from './component/CheckOutButton';
import Footer from './component/Footer';
import herocover from '../../assets/cover.png'
const LandingPage = () => {
    const navigate = useNavigate();


      
  return (
    <div className='landing-container'>
    <header className="header">
        <div className="text-section">
            <h1 className='headingText'>WELCOME TO <br></br>BOOK MASTER!</h1>
            <p className='subtext'>Borrow smarter, read better—only at USTP!</p>
            <div className='checkout-btn'>
                <CheckOutButton/>
            </div>
        </div>
        <div className="image-section">
            <img
                src= {herocover}
                alt="Business Illustration"
                className="header-image"
            />
        </div>
  </header>
  <Footer/>
  </div>
  )
};

export default LandingPage;
