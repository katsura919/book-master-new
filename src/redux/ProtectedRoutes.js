// src/redux/ProtectedRoutes.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
