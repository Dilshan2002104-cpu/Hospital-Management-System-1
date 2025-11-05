// User API service - simplified to match backend (only 5 fields)
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

export const userApi = {
  // Get all users (no status filtering - backend simplified)
  async getUsers() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch users');
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_BY_ID(userId));
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch user');
    }
  },

  // Get user by employee ID
  async getUserByEmployeeId(employeeId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_BY_EMPLOYEE_ID(employeeId));
      return response.data;
    } catch (error) {
      console.error('Error fetching user by employee ID:', error);
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch user');
    }
  },

  // Create new user - ONLY frontend fields
  async createUser(userData) {
    try {
      // Ensure we only send the 5 fields the backend expects
      const userPayload = {
        name: userData.name,
        employee_id: userData.employee_id,
        role: userData.role,
        department_id: userData.department_id,
        password: userData.password
      };

      console.log('Creating user with payload:', userPayload);
      const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, userPayload);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.detail;
        if (Array.isArray(validationErrors)) {
          const errorMessages = validationErrors.map(err => `${err.loc?.[1] || 'Field'}: ${err.msg}`).join(', ');
          throw new Error(`Validation errors: ${errorMessages}`);
        }
        throw new Error(error.response.data?.detail || 'Validation failed');
      }
      
      // Handle other validation errors
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid user data');
      }
      
      throw new Error(error.response?.data?.detail || error.message || 'Failed to create user');
    }
  },

  // Update user - only frontend fields
  async updateUser(userId, userData) {
    try {
      // Ensure we only send the 5 fields the backend expects
      const userPayload = {
        name: userData.name,
        employee_id: userData.employee_id,
        role: userData.role,
        department_id: userData.department_id,
        password: userData.password
      };

      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(userId), userPayload);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid user data');
      }
      throw new Error(error.response?.data?.detail || error.message || 'Failed to update user');
    }
  },

  // Update user password
  async updatePassword(userId, passwordData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PASSWORD(userId), passwordData);
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid password data');
      }
      throw new Error(error.response?.data?.detail || error.message || 'Failed to update password');
    }
  },

  // Delete user (soft delete - deactivate)
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(userId));
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(error.response?.data?.detail || error.message || 'Failed to delete user');
    }
  },

  // Search users
  async searchUsers(searchTerm, limit = 50) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.SEARCH(searchTerm), {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to search users');
    }
  },

  // Get users by department
  async getUsersByDepartment(departmentId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.BY_DEPARTMENT(departmentId));
      return response.data;
    } catch (error) {
      console.error('Error fetching users by department:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch users by department');
    }
  },

  // Get users by role
  async getUsersByRole(role) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ROLE(role));
      return response.data;
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch users by role');
    }
  }
};

export default userApi;