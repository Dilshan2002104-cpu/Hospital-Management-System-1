import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function OperationTheaterDashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    // Load OT-specific data here
    console.log('Operation Theater Dashboard loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-green-600">🏥 Operation Theater</h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Surgical Operations Management</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'OT Staff'}</p>
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
                onClick={() => setActiveTab('schedule')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'schedule' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📅</span>
                Surgery Schedule
              </button>
              
              <button
                onClick={() => setActiveTab('theaters')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'theaters' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🏥</span>
                Theater Status
              </button>
              
              <button
                onClick={() => setActiveTab('equipment')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'equipment' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🔧</span>
                Equipment
              </button>
              
              <button
                onClick={() => setActiveTab('staff')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'staff' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">👩‍⚕️</span>
                Surgical Team
              </button>
              
              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === 'inventory' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📦</span>
                Surgical Supplies
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-gray-600">Manage operation theater {activeTab}</p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'schedule' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Surgery Schedule</h3>
                <p className="text-gray-600 mb-4">Manage and schedule surgical operations</p>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={() => success('Surgery scheduling feature coming soon!')}
                >
                  Schedule Surgery
                </button>
              </div>
            )}

            {activeTab === 'theaters' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Operating Theater Status</h3>
                <p className="text-gray-600 mb-4">Monitor theater availability and status</p>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => success('Theater status feature coming soon!')}
                >
                  Check Theater Status
                </button>
              </div>
            )}

            {activeTab === 'equipment' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Surgical Equipment</h3>
                <p className="text-gray-600 mb-4">Manage and maintain surgical instruments</p>
                <button 
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  onClick={() => success('Equipment management feature coming soon!')}
                >
                  Check Equipment
                </button>
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👩‍⚕️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Surgical Team Management</h3>
                <p className="text-gray-600 mb-4">Coordinate surgical team assignments</p>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={() => success('Team management feature coming soon!')}
                >
                  Assign Team
                </button>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Surgical Supplies</h3>
                <p className="text-gray-600 mb-4">Track surgical supplies and inventory</p>
                <button 
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                  onClick={() => success('Supply management feature coming soon!')}
                >
                  Check Inventory
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}