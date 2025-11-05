import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Ward1Dashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    // Load Ward1-specific data here
    console.log('Ward 1 Dashboard loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-indigo-600">🏥 Ward 1 Dashboard</h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">General Medical Ward</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Ward Staff'}</p>
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
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">👥</span>
                Patients
              </button>
              
              <button
                onClick={() => setActiveTab('beds')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'beds' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🛏️</span>
                Bed Management
              </button>
              
              <button
                onClick={() => setActiveTab('nursing')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'nursing' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">👩‍⚕️</span>
                Nursing Care
              </button>
              
              <button
                onClick={() => setActiveTab('medications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'medications' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">💊</span>
                Medications
              </button>
              
              <button
                onClick={() => setActiveTab('rounds')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'rounds' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🩺</span>
                Doctor Rounds
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-gray-600">Manage Ward 1 {activeTab}</p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'patients' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ward Patient Management</h3>
                <p className="text-gray-600 mb-4">Manage inpatients in Ward 1</p>
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  onClick={() => success('Ward patient management feature coming soon!')}
                >
                  Admit Patient
                </button>
              </div>
            )}

            {activeTab === 'beds' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛏️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bed Management</h3>
                <p className="text-gray-600 mb-4">Monitor bed availability and assignments</p>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => success('Bed management feature coming soon!')}
                >
                  View Bed Status
                </button>
              </div>
            )}

            {activeTab === 'nursing' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👩‍⚕️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nursing Care</h3>
                <p className="text-gray-600 mb-4">Track nursing care plans and activities</p>
                <button 
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                  onClick={() => success('Nursing care feature coming soon!')}
                >
                  Update Care Plan
                </button>
              </div>
            )}

            {activeTab === 'medications' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Medication Administration</h3>
                <p className="text-gray-600 mb-4">Track patient medications and schedules</p>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={() => success('Medication tracking feature coming soon!')}
                >
                  Administer Medication
                </button>
              </div>
            )}

            {activeTab === 'rounds' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🩺</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Doctor Rounds</h3>
                <p className="text-gray-600 mb-4">Schedule and track doctor visits</p>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={() => success('Doctor rounds feature coming soon!')}
                >
                  Schedule Rounds
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}