// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    // Verifica si el usuario está autenticado
    // Por ejemplo, comprobando si hay un token en localStorage
    return localStorage.getItem('accessToken');
};

function PrivateRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
