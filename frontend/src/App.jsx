import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ClinicDashboard from './pages/ClinicDashboard';
import DialysisDashboard from './pages/DialysisDashboard';
import ICUDashboard from './pages/ICUDashboard';
import OperationTheaterDashboard from './pages/OperationTheaterDashboard';
import Ward1Dashboard from './pages/Ward1Dashboard';
import Ward2Dashboard from './pages/Ward2Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import SmartRedirect from './components/SmartRedirect';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              
              {/* Smart Redirect Routes */}
              <Route 
                path="/dashboard" 
                element={<SmartRedirect />} 
              />
              
              <Route 
                path="/" 
                element={<SmartRedirect />} 
              />
              
              <Route 
                path="/admin-dashboard/*" 
                element={
                  <ProtectedRoute requiredRoles={['Administrator']} requiredDepartment="Administration">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/clinic-dashboard/*" 
                element={
                  <ProtectedRoute requiredDepartment="Clinic">
                    <ClinicDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dialysis-dashboard/*" 
                element={
                  <ProtectedRoute requiredDepartment="Dialysis">
                    <DialysisDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/icu-dashboard/*" 
                element={
                  <ProtectedRoute requiredDepartment="Icu">
                    <ICUDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/operation-theater-dashboard/*" 
                element={
                  <ProtectedRoute requiredDepartment="Operation Theater">
                    <OperationTheaterDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ward1-dashboard/*" 
                element={
                  <ProtectedRoute requiredDepartment="Ward1">
                    <Ward1Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ward2-dashboard/*" 
                element={
                  <ProtectedRoute requiredDepartment="Ward2">
                    <Ward2Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route - Redirect to smart redirect */}
              <Route path="*" element={<SmartRedirect />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;