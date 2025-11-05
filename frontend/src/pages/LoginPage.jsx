import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import authApi from '../services/authApi';

export default function LoginPage() {
  const [formData, setFormData] = useState({ employeeId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = {};
    
    if (name === 'employeeId') {
      if (!value.trim()) {
        newErrors.employeeId = 'Employee ID is required';
      } else if (value.length < 3) {
        newErrors.employeeId = 'Employee ID must be at least 3 characters';
      } else if (!/^[A-Za-z0-9]+$/.test(value)) {
        newErrors.employeeId = 'Employee ID can only contain letters and numbers';
      }
    }
    
    if (name === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else if (value.length < 4) {
        newErrors.password = 'Password must be at least 4 characters';
      } else if (value.length > 20) {
        newErrors.password = 'Password must be less than 20 characters';
      }
    }
    
    return newErrors;
  };

  // Validate entire form
  const validateForm = () => {
    const employeeIdErrors = validateField('employeeId', formData.employeeId);
    const passwordErrors = validateField('password', formData.password);
    return { ...employeeIdErrors, ...passwordErrors };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear success message when user starts typing
    if (successMessage) setSuccessMessage('');
    
    // Real-time validation for current field
    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name] || ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const fieldErrors = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name] || ''
    }));
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ employeeId: true, password: true });
    
    // Validate entire form
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // Check if form has errors
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Call authentication API
      const response = await authApi.login(formData.employeeId, formData.password);
      
      if (response.success) {
        setSuccessMessage(`Welcome ${response.user.name}!`);
        success('Login successful!');
        
        // Login user with JWT token
        login(response.user, response.access_token);
        
        // Navigate to appropriate dashboard based on role
        const dashboardRoute = authApi.getDepartmentDashboard(response.user);
        setTimeout(() => {
          navigate(dashboardRoute);
        }, 800);
      } else {
        error('Login failed. Please check your credentials.');
        setErrors(prev => ({ ...prev, general: response.message || 'Login failed' }));
      }
    } catch (err) {
      console.error('Login error:', err);
      error(err.message || 'Login failed. Please check your credentials and try again.');
      setErrors(prev => ({ ...prev, general: err.message || 'Login failed. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.06) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.04) 0%, transparent 40%)'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3-1.567 3-3.5S13.657 1 12 1 9 2.567 9 4.5 10.343 8 12 8zM4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Hospital Login</h1>
          <p className="text-sm text-gray-600 mt-1">National Institute for Nephrology, Dialysis &amp; Transplantation</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          {successMessage && (
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-sm">
              {successMessage}
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.general}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Employee ID Field */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your employee ID"
                  autoComplete="username"
                />

              </div>
              {/* Error Message */}
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3 .895 3 2v3H9v-3c0-1.105 1.343-2 3-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V9a5 5 0 0110 0v2" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

              </div>
              {/* Error Message */}
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || Object.keys(errors).some(key => errors[key])}
                className={`w-full inline-flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium transition ${
                  isLoading || Object.keys(errors).some(key => errors[key])
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Secure access to Hospital Operation Management System
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          For technical support, contact IT department
        </div>
      </div>
    </div>
  );
}
