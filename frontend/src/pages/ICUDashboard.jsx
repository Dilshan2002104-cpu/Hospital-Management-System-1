import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function ICUDashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    // Load ICU-specific data here
    console.log('ICU Dashboard loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-red-600">🚨 ICU Dashboard</h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Intensive Care Unit</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'ICU Staff'}</p>
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
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🛏️</span>
                Critical Patients
              </button>
              
              <button
                onClick={() => setActiveTab('vitals')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'vitals' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">💓</span>
                Vital Signs
              </button>
              
              <button
                onClick={() => setActiveTab('ventilators')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'ventilators' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🫁</span>
                Ventilators
              </button>
              
              <button
                onClick={() => setActiveTab('medications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'medications' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">💉</span>
                Medications
              </button>
              
              <button
                onClick={() => setActiveTab('alerts')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'alerts' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">⚠️</span>
                Critical Alerts
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-gray-600">Manage ICU {activeTab}</p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'patients' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛏️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Critical Patient Management</h3>
                <p className="text-gray-600 mb-4">Monitor critically ill patients</p>
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={() => success('Critical patient management feature coming soon!')}
                >
                  Admit ICU Patient
                </button>
              </div>
            )}

            {activeTab === 'vitals' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💓</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vital Signs Monitoring</h3>
                <p className="text-gray-600 mb-4">Real-time patient vital signs</p>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={() => success('Vital signs monitoring feature coming soon!')}
                >
                  View Live Vitals
                </button>
              </div>
            )}

            {activeTab === 'ventilators' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🫁</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ventilator Management</h3>
                <p className="text-gray-600 mb-4">Monitor and control ventilator settings</p>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => success('Ventilator management feature coming soon!')}
                >
                  Check Ventilators
                </button>
              </div>
            )}

            {activeTab === 'medications' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💉</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Critical Care Medications</h3>
                <p className="text-gray-600 mb-4">Manage critical patient medications</p>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={() => success('Medication management feature coming soon!')}
                >
                  Administer Medication
                </button>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Critical Alerts</h3>
                <p className="text-gray-600 mb-4">Monitor emergency alerts and alarms</p>
                <button 
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                  onClick={() => success('Alert management feature coming soon!')}
                >
                  View Active Alerts
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}