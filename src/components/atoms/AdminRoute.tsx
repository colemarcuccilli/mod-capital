import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, currentUserProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading indicator while checking auth and profile
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  }

  if (!currentUser) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUserProfile?.role !== 'admin') {
    // Logged in, but not an admin, redirect to home or an unauthorized page
    console.warn("[AdminRoute] Access denied. User is not an admin.");
    // You might want to create a dedicated /unauthorized page later
    return <Navigate to="/" replace />; 
  }

  // User is logged in AND is an admin, render the requested component
  return <>{children}</>;
};

export default AdminRoute; 