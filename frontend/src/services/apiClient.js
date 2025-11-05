import axios from 'axios';
import { API_ENDPOINTS, DEPLOYMENT_INFO } from '../config/apiConfig';

// Create axios instance with centralized configuration
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.FULL_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store logout callback reference
let logoutCallback = null;

// Function to set logout callback from AuthContext
apiClient.setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

// Request interceptor for authentication and debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add JWT token to requests if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized/expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('401 Unauthorized - Token expired or invalid');
      
      // Use logout callback if available, otherwise fallback to direct logout
      if (logoutCallback) {
        logoutCallback();
      } else {
        // Fallback: Clear expired token directly
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_ENDPOINTS, DEPLOYMENT_INFO };