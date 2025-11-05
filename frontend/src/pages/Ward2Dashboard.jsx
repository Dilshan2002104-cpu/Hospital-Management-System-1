import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Ward2Dashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    // Load Ward2-specific data here
    console.log('Ward 2 Dashboard loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-cyan-600">🏥 Ward 2 Dashboard</h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Specialized Care Ward</span>
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
                    ? 'bg-cyan-100 text-cyan-700' 
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
                    ? 'bg-cyan-100 text-cyan-700' 
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
                    ? 'bg-cyan-100 text-cyan-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">👩‍⚕️</span>
                Specialized Care
              </button>
              
              <button
                onClick={() => setActiveTab('treatments')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'treatments' 
                    ? 'bg-cyan-100 text-cyan-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🩹</span>
                Treatments
              </button>
              
              <button
                onClick={() => setActiveTab('therapy')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'therapy' 
                    ? 'bg-cyan-100 text-cyan-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🏃‍♂️</span>
                Physical Therapy
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-gray-600">Manage Ward 2 {activeTab}</p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'patients' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Specialized Patient Care</h3>
                <p className="text-gray-600 mb-4">Manage specialized care patients in Ward 2</p>
                <button 
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
                  onClick={() => success('Specialized patient care feature coming soon!')}
                >
                  Admit Patient
                </button>
              </div>
            )}

            {activeTab === 'beds' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛏️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Specialized Bed Management</h3>
                <p className="text-gray-600 mb-4">Monitor specialized care bed availability</p>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => success('Specialized bed management feature coming soon!')}
                >
                  View Bed Status
                </button>
              </div>
            )}

            {activeTab === 'nursing' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👩‍⚕️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Specialized Nursing Care</h3>
                <p className="text-gray-600 mb-4">Advanced nursing care protocols</p>
                <button 
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                  onClick={() => success('Specialized nursing care feature coming soon!')}
                >
                  Update Care Protocol
                </button>
              </div>
            )}

            {activeTab === 'treatments' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🩹</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Treatments</h3>
                <p className="text-gray-600 mb-4">Specialized medical treatments and procedures</p>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={() => success('Treatment management feature coming soon!')}
                >
                  Schedule Treatment
                </button>
              </div>
            )}

            {activeTab === 'therapy' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏃‍♂️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Physical Therapy</h3>
                <p className="text-gray-600 mb-4">Rehabilitation and physical therapy programs</p>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={() => success('Physical therapy feature coming soon!')}
                >
                  Schedule Therapy
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}