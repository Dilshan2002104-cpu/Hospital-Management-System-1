// Central API Configuration for Easy Deployment
// Change only this file for different environments (development, staging, production)

// ====== DEPLOYMENT CONFIGURATION ======
// Choose your deployment environment by uncommenting one of these:

// 🔧 DEVELOPMENT (Local)
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENVIRONMENT: 'development'
};

// 🚀 PRODUCTION (Update with your server details)
// const API_CONFIG = {
//   BASE_URL: 'https://your-domain.com',  // Replace with your domain
//   ENVIRONMENT: 'production'
// };

// 🌐 STAGING/SERVER IP (Update with your server IP)  
// const API_CONFIG = {
//   BASE_URL: 'http://192.168.1.100:8000',  // Replace with your server IP
//   ENVIRONMENT: 'staging'
// };

// 📱 MOBILE/NETWORK (When accessing from other devices)
// const API_CONFIG = {
//   BASE_URL: 'http://your-computer-ip:8000',  // Replace with your computer's IP
//   ENVIRONMENT: 'mobile'
// };

// ====== ENVIRONMENT OVERRIDE ======
// Environment variable takes priority (for automated deployments)
if (import.meta.env.VITE_API_BASE_URL) {
  API_CONFIG.BASE_URL = import.meta.env.VITE_API_BASE_URL;
  API_CONFIG.ENVIRONMENT = 'env-override';
}

// ====== API ENDPOINTS ======
export const API_ENDPOINTS = {
  // Base configuration
  BASE_URL: API_CONFIG.BASE_URL,
  API_VERSION: '/api/v1',
  FULL_BASE_URL: `${API_CONFIG.BASE_URL}/api/v1`,
  
  // User endpoints
  USERS: {
    BASE: '/users',
    GET_ALL: '/users/',
    GET_BY_ID: (id) => `/users/${id}`,
    GET_BY_EMPLOYEE_ID: (employeeId) => `/users/employee/${employeeId}`,
    CREATE: '/users/',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    UPDATE_PASSWORD: (id) => `/users/${id}/password`,
    SEARCH: (term) => `/users/search/${encodeURIComponent(term)}`,
    BY_DEPARTMENT: (deptId) => `/users/department/${deptId}`,
    BY_ROLE: (role) => `/users/role/${encodeURIComponent(role)}`
  },
  
  // Department endpoints
  DEPARTMENTS: {
    BASE: '/departments',
    GET_ALL: '/departments/',
    GET_BY_ID: (id) => `/departments/${id}`,
    CREATE: '/departments/',
    UPDATE: (id) => `/departments/${id}`,
    DELETE: (id) => `/departments/${id}`
  },
  
  // Health check endpoint
  HEALTH: '/health'
};

// ====== DEPLOYMENT HELPERS ======
export const DEPLOYMENT_INFO = {
  ENVIRONMENT: API_CONFIG.ENVIRONMENT,
  BASE_URL: API_CONFIG.BASE_URL,
  FULL_API_URL: `${API_CONFIG.BASE_URL}/api/v1`,
  IS_DEVELOPMENT: API_CONFIG.ENVIRONMENT === 'development',
  IS_PRODUCTION: API_CONFIG.ENVIRONMENT === 'production',
  
  // Helper to log deployment info
  logInfo() {
    console.log('🚀 API Deployment Configuration:');
    console.log(`   Environment: ${this.ENVIRONMENT}`);
    console.log(`   Base URL: ${this.BASE_URL}`);
    console.log(`   Full API URL: ${this.FULL_API_URL}`);
    console.log(`   Development Mode: ${this.IS_DEVELOPMENT}`);
  }
};

// ====== QUICK DEPLOYMENT GUIDE ======
export const DEPLOYMENT_GUIDE = {
  STEPS: [
    "1. 🔧 FOR LOCAL DEVELOPMENT: Use the default configuration (localhost:8000)",
    "2. 🌐 FOR NETWORK ACCESS: Uncomment 'MOBILE/NETWORK' section and set your computer's IP",
    "3. 🖥️  FOR SERVER DEPLOYMENT: Uncomment 'STAGING/SERVER IP' and set your server IP",
    "4. 🚀 FOR PRODUCTION: Uncomment 'PRODUCTION' section and set your domain",
    "5. 📦 FOR AUTOMATED DEPLOYMENT: Set VITE_API_BASE_URL environment variable"
  ],
  
  EXAMPLES: {
    LOCAL: "http://localhost:8000",
    NETWORK: "http://192.168.1.105:8000",
    SERVER: "http://your-server-ip:8000", 
    PRODUCTION: "https://your-domain.com",
    ENV_VAR: "VITE_API_BASE_URL=https://api.yoursite.com"
  }
};

// Log deployment info in development
if (DEPLOYMENT_INFO.IS_DEVELOPMENT) {
  DEPLOYMENT_INFO.logInfo();
}

export default API_CONFIG;