import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

export const departmentApi = {
  // Create a new department
  createDepartment: async (departmentData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.DEPARTMENTS.CREATE, departmentData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error creating department:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message || 'Failed to create department'
      };
    }
  },

  // Get all departments
  getAllDepartments: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DEPARTMENTS.GET_ALL);
      return {
        success: true,
        data: response.data.departments || [],
        total: response.data.total || 0,
        error: null
      };
    } catch (error) {
      console.error('Error fetching departments:', error);
      return {
        success: false,
        data: [],
        total: 0,
        error: error.response?.data?.detail || error.message || 'Failed to fetch departments'
      };
    }
  },

  // Get only active departments (for dropdowns)
  getActiveDepartments: async () => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.DEPARTMENTS.BASE}/active`);
      return {
        success: true,
        data: response.data || [],
        error: null
      };
    } catch (error) {
      console.error('Error fetching active departments:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.detail || error.message || 'Failed to fetch active departments'
      };
    }
  },

  // Get department by ID
  getDepartmentById: async (departmentId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DEPARTMENTS.GET_BY_ID(departmentId));
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching department:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message || 'Failed to fetch department'
      };
    }
  },

  // Update department
  updateDepartment: async (departmentId, departmentData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.DEPARTMENTS.UPDATE(departmentId), departmentData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating department:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message || 'Failed to update department'
      };
    }
  },

  // Delete department
  deleteDepartment: async (departmentId) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.DEPARTMENTS.DELETE(departmentId));
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error deleting department:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message || 'Failed to delete department'
      };
    }
  }
};

export default departmentApi;