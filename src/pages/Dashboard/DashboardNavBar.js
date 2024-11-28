// src/pages/Dashboard/DashboardNavbar.js
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { LuLayoutDashboard } from "react-icons/lu";
import { RiHome2Line } from "react-icons/ri";
import { RiFilePaper2Line } from "react-icons/ri";
import { PiBooksLight } from "react-icons/pi";
import logo from '../../assets/logo.png';



import './DashboardNavBar.css'
const DashboardNavbar = () => {
    
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
          
            <div className="sidebar-content">
                <div className='header-wrapper'>
                    
                <div className='logo-close-btn'>
                    <Link to="/hero">
                    <img
                    src= {logo}
                    alt="Business Illustration"
                    className="logo-dashboard"
                />
                    </Link>
                
                <button className="dash-close-btn" onClick={toggleSidebar}>
                    {isExpanded ? "←" : "→"}
                    </button>
                </div>
                
                </div>
                <ul className='dash-nav'> 
                    
                    <li className='dash-list'>
                        <Link className='dash-link' to="/dashboard">
                            <LuLayoutDashboard  size={20}/>
                            {isExpanded && <span>Dashboard</span>}
                        </Link>
                    </li>
                    <li className='dash-list'>
                        <Link className='dash-link' to="/dashboard/bookreq">
                            <RiFilePaper2Line size={20}/>
                            {isExpanded && <span>Requests</span>}
                        </Link>
                    </li>
                    <li className='dash-list'>
                        <Link className='dash-link' to="/dashboard/addbook">
                            <PiBooksLight size={20}/>
                            {isExpanded && <span>Books</span>}
                        </Link>
                    </li>
                    
                </ul>

                
            </div>
        </div>
    );
};

export default DashboardNavbar;
