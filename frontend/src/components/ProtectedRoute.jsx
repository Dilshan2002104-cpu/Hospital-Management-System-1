import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import authApi from '../services/authApi';

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  requiredDepartment = null,
  allowAdminOverride = true 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    const isAdmin = user.role === 'Administrator';
    
    if (!hasRequiredRole && !(allowAdminOverride && isAdmin)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
              <p className="text-sm text-gray-500 mb-4">
                You don't have permission to access this page. Required roles: {requiredRoles.join(', ')}
              </p>
              <p className="text-xs text-gray-400">
                Current role: {user.role}
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Check department requirements
  if (requiredDepartment !== null) {
    const hasRequiredDepartment = user.department_name === requiredDepartment;
    const isAdmin = user.role === 'Administrator';
    
    if (!hasRequiredDepartment && !(allowAdminOverride && isAdmin)) {
      // Redirect to user's correct dashboard instead of showing error
      const correctDashboard = authApi.getDepartmentDashboard(user);
      return <Navigate to={correctDashboard} replace />;
    }
  }

  // All checks passed, render the protected component
  return children;
};

export default ProtectedRoute;