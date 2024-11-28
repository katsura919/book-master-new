// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet} from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';

import store from './redux/store';
import Navbar from './pages/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/LandingPage/Login';
import Register from './pages/LandingPage/Register';
import ProtectedRoute from './redux/ProtectedRoutes';
import BookBorrowForm from './pages/BorrowForm/BookBorrowForm';
import DashboardNavBar from './pages/Dashboard/DashboardNavBar';
import Overview from './pages/Dashboard/Overview';
import BookReq from './pages/Dashboard/BookReq';
import SearchResults from './pages/Navbar/component/SearchResults';
import Books from './pages/Dashboard/Books';
import BookDetails from './pages/Navbar/component/BookDetails';
import AllBooks from './pages/LandingPage/AllBooks';
const App = () => {

    
    return (
        <Provider store={store}>
        <Router>
            <Routes>
                {/* Routes with Navbar */}
                <Route element={<LayoutWithNavbar />}>
                    <Route path="/hero" element={<LandingPage />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/allbooks" element={<AllBooks />} />
                    <Route path="/borrow" element={<BookBorrowForm />} />
                    <Route path="/bookdetails/:bookId" element={<BookDetails />} />
                </Route>

                {/* Routes without Navbar */}
                <Route path="/dashboard" element={<ProtectedRoute component={DashboardLayout} />}>
                        <Route index element={<Overview />} />
                        <Route path="bookreq" element={<BookReq />} />
                        <Route path="addbook" element={<Books />} />
                    </Route>
             
                <Route path="/" element={<Navigate to="/hero" />} />
            </Routes>
        </Router>
    </Provider>
    );
};

const LayoutWithNavbar = () => (
    <>
        <Navbar />
        <Outlet />
    </>
);

const DashboardLayout = () => (
    <div>
        <DashboardNavBar/>
        <Outlet /> {/* Renders nested routes (subpages) */}
    </div>
);

export default App;
