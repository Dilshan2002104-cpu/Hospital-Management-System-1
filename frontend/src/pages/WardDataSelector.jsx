import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { departmentApi } from '../services/departmentApi';

export default function WardDataSelector() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWard, setSelectedWard] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { error } = useToast();

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear - 5; year <= currentYear + 5; year++) {
    yearOptions.push(year);
  }

  // Month options
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Load departments on component mount
  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await departmentApi.getActiveDepartments();
      setDepartments(response.data || []);
      
      // Auto-select user's department if available
      if (user?.department_id) {
        setSelectedWard(user.department_id.toString());
      }
    } catch (err) {
      error('Failed to load departments');
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  }, [user, error]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const handleProceed = () => {
    if (!selectedWard) {
      error('Please select a ward');
      return;
    }

    // Navigate to data entry page with selected parameters
    navigate(`/ward-data-entry/${selectedWard}/${selectedYear}/${selectedMonth}`);
  };

  const getSelectedMonthName = () => {
    const month = monthOptions.find(m => m.value === selectedMonth);
    return month ? month.label : '';
  };

  const getSelectedWardName = () => {
    const ward = departments.find(d => d.id.toString() === selectedWard);
    return ward ? ward.name : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">📊 Ward Monthly Data Entry</h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Medical Statistics Management</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role} • {user?.department_name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Ward Data Entry Selector
            </h2>
            <p className="text-gray-600">
              Choose the year, month, and ward for which you want to enter medical statistics data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Year Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                📅 Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                📆 Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                🏥 Ward
              </label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                disabled={loading}
              >
                <option value="">Select Ward...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedWard && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                📋 Selected Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Year:</span>
                  <span className="ml-2 text-blue-900">{selectedYear}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Month:</span>
                  <span className="ml-2 text-blue-900">{getSelectedMonthName()}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Ward:</span>
                  <span className="ml-2 text-blue-900">{getSelectedWardName()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
            
            <button
              onClick={handleProceed}
              disabled={!selectedWard || loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center space-x-2 text-lg font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Proceed to Data Entry</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-amber-800">Information</h4>
                <p className="text-sm text-amber-700 mt-1">
                  You'll be entering medical statistics data for one specific month. 
                  The system will automatically calculate totals and percentages to reduce errors.
                  Data can be saved as draft, submitted for review, and approved by authorized personnel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}