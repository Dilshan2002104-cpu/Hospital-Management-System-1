import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Auto-logout timer ref
  const logoutTimerRef = useRef(null);

  // Check if token is valid (not expired)
  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  };

  // Clear authentication data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear auto-logout timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  // Set up automatic logout timer based on token expiration
  const setupAutoLogout = useCallback((token) => {
    // Clear existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      // Set timer to logout 30 seconds before expiration
      const logoutTime = Math.max(timeUntilExpiration - 30000, 0);

      if (logoutTime > 0) {
        logoutTimerRef.current = setTimeout(() => {
          console.log('Token expired - automatic logout');
          clearAuthData();
        }, logoutTime);
      } else {
        // Token already expired
        clearAuthData();
      }
    } catch (error) {
      console.error('Error setting up auto-logout:', error);
    }
  }, [clearAuthData]);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Check if token is expired
          if (isTokenValid(storedToken)) {
            setToken(storedToken);
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            // Setup automatic logout timer for existing session
            setupAutoLogout(storedToken);
          } else {
            // Token expired, clear storage
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuthData, setupAutoLogout]);

  // Login function
  const login = (userData, accessToken) => {
    try {
      setUser(userData);
      setToken(accessToken);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Setup automatic logout timer
      setupAutoLogout(accessToken);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    console.log('User logged out');
    clearAuthData();
  }, [clearAuthData]);

  // Register logout callback with apiClient
  useEffect(() => {
    apiClient.setLogoutCallback(logout);
  }, [logout]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Check if user belongs to specific department
  const belongsToDepartment = (departmentId) => {
    return user?.department_id === departmentId;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'Administrator';
  };

  // Get authorization header for API calls
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Auto-logout when token expires
  useEffect(() => {
    if (token && isAuthenticated) {
      const checkTokenExpiration = () => {
        if (!isTokenValid(token)) {
          logout();
        }
      };

      // Check token every minute
      const interval = setInterval(checkTokenExpiration, 60000);
      return () => clearInterval(interval);
    }
  }, [token, isAuthenticated, logout]);

  const value = {
    user,
    isAuthenticated,
    token,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    belongsToDepartment,
    isAdmin,
    getAuthHeader,
    clearAuthData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;