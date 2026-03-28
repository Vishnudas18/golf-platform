import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import Loader from './Loader';

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireSubscription = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isActive, isLoading: isSubLoading } = useSubscription();
  const location = useLocation();

  if (isLoading || (requireSubscription && isSubLoading)) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireSubscription && !isActive && user?.role !== 'admin') {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
};

export default ProtectedRoute;
