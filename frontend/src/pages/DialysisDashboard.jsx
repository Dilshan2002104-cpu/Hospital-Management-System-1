import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function DialysisDashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    // Load dialysis-specific data here
    console.log('Dialysis Dashboard loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-teal-600">🫘 Dialysis Center</h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Renal Care Management</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Dialysis Staff'}</p>
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('patients')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'patients' 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🫀</span>
                Dialysis Patients
              </button>
              
              <button
                onClick={() => setActiveTab('machines')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'machines' 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">⚙️</span>
                Machines
              </button>
              
              <button
                onClick={() => setActiveTab('sessions')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'sessions' 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">⏱️</span>
                Sessions
              </button>
              
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'monitoring' 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📊</span>
                Monitoring
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-gray-600">Manage dialysis {activeTab}</p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'patients' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🫀</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Dialysis Patient Management</h3>
                <p className="text-gray-600 mb-4">Manage chronic kidney disease patients</p>
                <button 
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                  onClick={() => success('Dialysis patient management feature coming soon!')}
                >
                  Add Dialysis Patient
                </button>
              </div>
            )}

            {activeTab === 'machines' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Dialysis Machine Management</h3>
                <p className="text-gray-600 mb-4">Monitor and maintain dialysis equipment</p>
                <button 
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  onClick={() => success('Machine management feature coming soon!')}
                >
                  Check Machine Status
                </button>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏱️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Dialysis Sessions</h3>
                <p className="text-gray-600 mb-4">Schedule and track dialysis sessions</p>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => success('Session management feature coming soon!')}
                >
                  Start New Session
                </button>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Monitoring</h3>
                <p className="text-gray-600 mb-4">Real-time patient vital monitoring</p>
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={() => success('Patient monitoring feature coming soon!')}
                >
                  View Vital Signs
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}