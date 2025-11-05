/**
 * Authentication API service
 */
import apiClient from './apiClient';

const authApi = {
  /**
   * Login user with employee ID and password
   * @param {string} employeeId - User's employee ID
   * @param {string} password - User's password
   * @returns {Promise} Login response with user data and token
   */
  async login(employeeId, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        employee_id: employeeId,
        password: password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  },

  /**
   * Logout current user
   * @returns {Promise} Logout response
   */
  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error for logout, just log it
      return { success: false, message: 'Logout request failed' };
    }
  },

  /**
   * Refresh access token
   * @param {string} token - Current access token
   * @returns {Promise} Refresh response with new token
   */
  async refreshToken(token) {
    try {
      const response = await apiClient.post('/auth/refresh', {
        token: token
      });
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw this.handleAuthError(error);
    }
  },

  /**
   * Get current user information
   * @returns {Promise} Current user data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw this.handleAuthError(error);
    }
  },

  /**
   * Handle authentication errors consistently
   * @param {Error} error - Original error
   * @returns {Error} Formatted error
   */
  handleAuthError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error(data?.detail || 'Invalid credentials or expired session');
        case 403:
          return new Error(data?.detail || 'Access denied. Insufficient permissions');
        case 422:
          return new Error('Invalid input data. Please check your credentials');
        case 500:
          return new Error('Server error. Please try again later');
        default:
          return new Error(data?.detail || 'Authentication failed');
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection');
    } else {
      return new Error('An unexpected error occurred');
    }
  },

  /**
   * Check if user has specific role
   * @param {Object} user - User object
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role
   */
  hasRole(user, role) {
    return user?.role === role;
  },

  /**
   * Check if user has any of the specified roles
   * @param {Object} user - User object
   * @param {Array} roles - Array of roles to check
   * @returns {boolean} True if user has any of the roles
   */
  hasAnyRole(user, roles) {
    return roles.includes(user?.role);
  },

  /**
   * Check if user belongs to specific department
   * @param {Object} user - User object
   * @param {number} departmentId - Department ID to check
   * @returns {boolean} True if user belongs to department
   */
  belongsToDepartment(user, departmentId) {
    return user?.department_id === departmentId;
  },

  /**
   * Check if user is administrator
   * @param {Object} user - User object
   * @returns {boolean} True if user is admin
   */
  isAdmin(user) {
    return user?.role === 'Administrator';
  },

  /**
   * Get role-based navigation items
   * @param {Object} user - User object
   * @returns {Array} Array of navigation items for user's role
   */
  getRoleBasedNavigation(user) {
    if (!user) return [];

    const baseNavigation = [
      { name: 'Dashboard', path: '/dashboard', roles: ['all'] }
    ];

    const roleSpecificNavigation = {
      'Administrator': [
        { name: 'User Management', path: '/admin/users', roles: ['Administrator'] },
        { name: 'Department Management', path: '/admin/departments', roles: ['Administrator'] },
        { name: 'System Settings', path: '/admin/settings', roles: ['Administrator'] },
        { name: 'Reports', path: '/admin/reports', roles: ['Administrator'] }
      ],
      'Doctor': [
        { name: 'Patients', path: '/patients', roles: ['Doctor', 'Nurse'] },
        { name: 'Medical Records', path: '/medical-records', roles: ['Doctor', 'Nurse'] },
        { name: 'Prescriptions', path: '/prescriptions', roles: ['Doctor'] },
        { name: 'Appointments', path: '/appointments', roles: ['Doctor', 'Nurse', 'Receptionist'] }
      ],
      'Nurse': [
        { name: 'Patients', path: '/patients', roles: ['Doctor', 'Nurse'] },
        { name: 'Medical Records', path: '/medical-records', roles: ['Doctor', 'Nurse'] },
        { name: 'Appointments', path: '/appointments', roles: ['Doctor', 'Nurse', 'Receptionist'] }
      ],
      'Lab Technician': [
        { name: 'Lab Results', path: '/lab-results', roles: ['Lab Technician', 'Doctor'] },
        { name: 'Patients', path: '/patients', roles: ['Lab Technician', 'Doctor', 'Nurse'] }
      ],
      'Pharmacist': [
        { name: 'Prescriptions', path: '/prescriptions', roles: ['Pharmacist', 'Doctor'] },
        { name: 'Medications', path: '/medications', roles: ['Pharmacist'] },
        { name: 'Inventory', path: '/pharmacy/inventory', roles: ['Pharmacist'] }
      ],
      'Receptionist': [
        { name: 'Patients', path: '/patients', roles: ['Receptionist', 'Doctor', 'Nurse'] },
        { name: 'Appointments', path: '/appointments', roles: ['Receptionist', 'Doctor', 'Nurse'] },
        { name: 'Registration', path: '/registration', roles: ['Receptionist'] }
      ]
    };

    return [
      ...baseNavigation,
      ...(roleSpecificNavigation[user.role] || [])
    ];
  },

  /**
   * Get department-specific dashboard route
   * @param {Object} user - User object
   * @returns {string} Dashboard route for user's department
   */
  getDepartmentDashboard(user) {
    if (!user) return '/login';

    // Map department names to dashboard routes
    const departmentRoutes = {
      'Administration': '/admin-dashboard',
      'Clinic': '/clinic-dashboard', 
      'Dialysis': '/dialysis-dashboard',
      'Icu': '/icu-dashboard',  // Updated to match JWT token format
      'ICU': '/icu-dashboard',  // Keep both formats for compatibility
      'Operation Theater': '/operation-theater-dashboard',
      'Ward1': '/ward1-dashboard',
      'Ward2': '/ward2-dashboard'
    };

    // Get dashboard route based on department name
    const dashboardRoute = departmentRoutes[user.department_name];
    
    // Fallback: if no department mapping found, use role-based routing
    if (!dashboardRoute) {
      if (user.role === 'Administrator') {
        return '/admin-dashboard';
      }
      // No default fallback - redirect to login if no valid department/role
      return '/login';
    }

    return dashboardRoute;
  }
};

export default authApi;