import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function DashboardSelector() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const dashboards = [
    {
      id: 'admin',
      name: 'Admin Dashboard',
      description: 'System Administration',
      icon: '⚙️',
      color: 'bg-gray-600 hover:bg-gray-700',
      route: '/admin-dashboard',
      roles: ['Administrator', 'System Administrator']
    },
    {
      id: 'clinic',
      name: 'Clinic',
      description: 'Outpatient Care',
      icon: '🏥',
      color: 'bg-blue-600 hover:bg-blue-700',
      route: '/clinic-dashboard',
      roles: ['Doctor', 'Nurse', 'Receptionist']
    },
    {
      id: 'dialysis',
      name: 'Dialysis Center',
      description: 'Renal Care',
      icon: '🫘',
      color: 'bg-teal-600 hover:bg-teal-700',
      route: '/dialysis-dashboard',
      roles: ['Doctor', 'Nurse', 'Lab Technician']
    },
    {
      id: 'icu',
      name: 'ICU',
      description: 'Intensive Care',
      icon: '🚨',
      color: 'bg-red-600 hover:bg-red-700',
      route: '/icu-dashboard',
      roles: ['Doctor', 'Nurse']
    },
    {
      id: 'operation-theater',
      name: 'Operation Theater',
      description: 'Surgical Operations',
      icon: '🏥',
      color: 'bg-green-600 hover:bg-green-700',
      route: '/operation-theater-dashboard',
      roles: ['Doctor', 'Nurse']
    },
    {
      id: 'ward1',
      name: 'Ward 1',
      description: 'General Medical Ward',
      icon: '🏥',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      route: '/ward1-dashboard',
      roles: ['Doctor', 'Nurse']
    },
    {
      id: 'ward2',
      name: 'Ward 2',
      description: 'Specialized Care Ward',
      icon: '🏥',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      route: '/ward2-dashboard',
      roles: ['Doctor', 'Nurse']
    }
  ];

  // Filter dashboards based on user role
  const availableDashboards = dashboards.filter(dashboard => 
    dashboard.roles.includes(user?.role) || user?.role === 'Administrator'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">🏥 Hospital Management System</h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Select Department Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Staff'}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Workspace</h2>
          <p className="text-lg text-gray-600">Select a department dashboard to access specific features and tools</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableDashboards.map((dashboard) => (
            <div
              key={dashboard.id}
              onClick={() => navigate(dashboard.route)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl bg-gray-100 rounded-full">
                  {dashboard.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  {dashboard.name}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {dashboard.description}
                </p>
                <button
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${dashboard.color}`}
                >
                  Access Dashboard
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Access Message */}
        {availableDashboards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Dashboard Access</h3>
            <p className="text-gray-600">Contact your administrator to grant access to department dashboards.</p>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/admin-dashboard')}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
            >
              System Settings
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
              Help & Support
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
              User Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}