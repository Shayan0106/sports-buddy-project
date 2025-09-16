import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();

  // Show a loading indicator while auth state is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's a user and their role is 'admin', render the component.
  // Otherwise, redirect to the home page.
  if (currentUser && userRole === 'admin') {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminRoute;