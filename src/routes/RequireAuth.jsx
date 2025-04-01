import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If user is not logged in, redirect them to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default RequireAuth;
