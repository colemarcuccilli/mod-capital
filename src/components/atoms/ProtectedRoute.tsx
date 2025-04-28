import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Assuming a simple spinner component exists

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading indicator while checking auth status
    // You might want a more centered/fullscreen loading indicator here
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  }

  if (!currentUser) {
    // User not logged in, redirect them to the login page
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, render the requested component
  return <>{children}</>;
};

export default ProtectedRoute; 