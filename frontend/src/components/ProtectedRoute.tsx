import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
