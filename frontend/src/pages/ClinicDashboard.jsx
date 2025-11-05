import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    // Load clinic-specific data here
    console.log('Clinic Dashboard loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">🏥 Clinic Dashboard</h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Outpatient Care Management</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Clinic Staff'}</p>
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
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">👥</span>
                Patients
              </button>
              
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'appointments' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📅</span>
                Appointments
              </button>
              
              <button
                onClick={() => setActiveTab('consultations')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'consultations' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🩺</span>
                Consultations
              </button>
              
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'prescriptions' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">💊</span>
                Prescriptions
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-gray-600">Manage clinic {activeTab}</p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'patients' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Management</h3>
                <p className="text-gray-600 mb-4">Manage outpatient records and information</p>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => success('Patient management feature coming soon!')}
                >
                  Add New Patient
                </button>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Scheduling</h3>
                <p className="text-gray-600 mb-4">Schedule and manage patient appointments</p>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={() => success('Appointment scheduling feature coming soon!')}
                >
                  Schedule Appointment
                </button>
              </div>
            )}

            {activeTab === 'consultations' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🩺</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Consultation Records</h3>
                <p className="text-gray-600 mb-4">Track patient consultations and diagnoses</p>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={() => success('Consultation records feature coming soon!')}
                >
                  New Consultation
                </button>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Prescription Management</h3>
                <p className="text-gray-600 mb-4">Create and manage patient prescriptions</p>
                <button 
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                  onClick={() => success('Prescription management feature coming soon!')}
                >
                  Create Prescription
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}