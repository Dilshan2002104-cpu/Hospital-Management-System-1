import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { departmentApi } from '../services/departmentApi';
import { userApi } from '../services/userApi';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateDepartmentForm, setShowCreateDepartmentForm] = useState(false);
  const [showEditDepartmentForm, setShowEditDepartmentForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  
  // User edit and delete states
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success, error } = useToast();
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [departmentError, setDepartmentError] = useState('');

  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Doctor',
    departmentId: '',
    employeeId: '',
    password: ''
  });

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    status: 'Active'
  });

  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load departments and users on component mount
  useEffect(() => {
    loadDepartments();
    loadUsers();
  }, []);

  // Load all departments from API
  const loadDepartments = async () => {
    setLoadingDepartments(true);
    setDepartmentError('');
    
    const result = await departmentApi.getAllDepartments();
    
    if (result.success) {
      setDepartments(result.data);
    } else {
      setDepartmentError(result.error);
      console.error('Failed to load departments:', result.error);
    }
    
    setLoadingDepartments(false);
  };

  // Load all users from API
  const loadUsers = async () => {
    setLoadingUsers(true);
    setUserError('');
    
    try {
      const result = await userApi.getUsers();
      // Backend returns { users: [...], total: ..., page: ..., per_page: ... }
      setUsers(result.users || []);
    } catch (err) {
      setUserError(err.message || 'Failed to load users');
      console.error('Failed to load users:', err);
      setUsers([]); // Ensure users is always an array
    }
    
    setLoadingUsers(false);
  };

  const generateEmployeeId = () => {
    // Find the highest existing employee ID number
    const safeUsers = Array.isArray(users) ? users : [];
    const existingIds = safeUsers
      .map(user => user?.employee_id)
      .filter(id => id && id.startsWith('EMP'))
      .map(id => parseInt(id.replace('EMP', '')))
      .filter(num => !isNaN(num));
    
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const nextId = maxId + 1;
    return `EMP${String(nextId).padStart(3, '0')}`;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoadingUsers(true);
    setUserError('');
    
    try {
      // Validate required fields
      if (!newUser.name || !newUser.departmentId || !newUser.password) {
        setUserError('Please fill in all required fields');
        setLoadingUsers(false);
        return;
      }

      // Validate name format
      const nameRegex = /^[a-zA-Z\s.'-]+$/;
      if (!nameRegex.test(newUser.name)) {
        setUserError('Name can only contain letters, spaces, dots, hyphens, and apostrophes');
        setLoadingUsers(false);
        return;
      }

      // Validate password requirements
      if (newUser.password.length < 6) {
        setUserError('Password must be at least 6 characters long');
        setLoadingUsers(false);
        return;
      }

      if (!/[A-Za-z]/.test(newUser.password)) {
        setUserError('Password must contain at least one letter');
        setLoadingUsers(false);
        return;
      }

      if (!/\d/.test(newUser.password)) {
        setUserError('Password must contain at least one digit');
        setLoadingUsers(false);
        return;
      }

      const userData = {
        name: newUser.name,
        employee_id: newUser.employeeId || generateEmployeeId(),
        role: newUser.role,
        department_id: parseInt(newUser.departmentId),
        password: newUser.password
      };

      await userApi.createUser(userData);
      
      // User created successfully - backend returns user data directly
      success('User created successfully!');
      setNewUser({ name: '', role: 'Doctor', departmentId: '', employeeId: '', password: '' });
      setShowCreateUserForm(false);
      
      // Reload users to get the updated list
      await loadUsers();
      
    } catch (err) {
      setUserError(err.message || 'Failed to create user');
      console.error('Failed to create user:', err);
    }
    
    setLoadingUsers(false);
  };

  // Updated handleCreateDepartment to use API
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    setLoadingDepartments(true);
    setDepartmentError('');

    const result = await departmentApi.createDepartment({
      name: newDepartment.name
    });

    if (result.success) {
      // Show success toast instead of success message
      success(result.data.message || 'Department created successfully!');
      setNewDepartment({ name: '', status: 'Active' });
      setShowCreateDepartmentForm(false);
      
      // Reload departments to get the updated list
      await loadDepartments();
    } else {
      setDepartmentError(result.error);
    }

    setLoadingDepartments(false);
  };

  // Handle edit department
  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setNewDepartment({
      name: department.name,
      status: department.status
    });
    setShowEditDepartmentForm(true);
    setDepartmentError('');
  };

  // Handle update department
  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    setLoadingDepartments(true);
    setDepartmentError('');

    const result = await departmentApi.updateDepartment(editingDepartment.id, {
      name: newDepartment.name,
      status: newDepartment.status
    });

    if (result.success) {
      success('Department updated successfully!');
      setNewDepartment({ name: '', status: 'Active' });
      setShowEditDepartmentForm(false);
      setEditingDepartment(null);
      
      // Reload departments to get the updated list
      await loadDepartments();
    } else {
      setDepartmentError(result.error);
    }

    setLoadingDepartments(false);
  };

  // Handle delete confirmation
  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setShowDeleteConfirm(true);
  };

  // Handle delete department
  const handleDeleteDepartment = async () => {
    setLoadingDepartments(true);

    const result = await departmentApi.deleteDepartment(departmentToDelete.id);

    if (result.success) {
      success('Department deleted successfully!');
      setShowDeleteConfirm(false);
      setDepartmentToDelete(null);
      
      // Reload departments to get the updated list
      await loadDepartments();
    } else {
      error(result.error || 'Failed to delete department');
      setShowDeleteConfirm(false);
    }

    setLoadingDepartments(false);
  };

  // User edit and delete functions
  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setNewUser({
      name: userToEdit.name,
      role: userToEdit.role,
      departmentId: userToEdit.department_id,
      employeeId: userToEdit.employee_id,
      password: '' // Don't populate password for security
    });
    setShowEditUserForm(true);
    setUserError('');
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoadingUsers(true);
    setUserError('');

    try {
      // Validate required fields
      if (!newUser.name) {
        setUserError('Name is required');
        setLoadingUsers(false);
        return;
      }

      // Validate name format
      const nameRegex = /^[a-zA-Z\s.'-]+$/;
      if (!nameRegex.test(newUser.name)) {
        setUserError('Name can only contain letters, spaces, dots, hyphens, and apostrophes');
        setLoadingUsers(false);
        return;
      }

      // Validate password if provided
      if (newUser.password.trim()) {
        if (newUser.password.length < 6) {
          setUserError('Password must be at least 6 characters long');
          setLoadingUsers(false);
          return;
        }

        if (!/[A-Za-z]/.test(newUser.password)) {
          setUserError('Password must contain at least one letter');
          setLoadingUsers(false);
          return;
        }

        if (!/\d/.test(newUser.password)) {
          setUserError('Password must contain at least one digit');
          setLoadingUsers(false);
          return;
        }
      }

      const updateData = {
        name: newUser.name,
        role: newUser.role,
        department_id: parseInt(newUser.departmentId)
      };

      // Only include password if it's provided
      if (newUser.password.trim()) {
        updateData.password = newUser.password;
      }

      await userApi.updateUser(editingUser.id, updateData);
      
      success('User updated successfully!');
      setNewUser({
        name: '',
        role: 'Doctor',
        departmentId: '',
        employeeId: '',
        password: ''
      });
      setShowEditUserForm(false);
      setEditingUser(null);
      
      // Reload users to get the updated list
      await loadUsers();
    } catch (err) {
      setUserError(err.message || 'Failed to update user');
      error(err.message || 'Failed to update user');
    }

    setLoadingUsers(false);
  };

  const handleDeleteUserClick = (userToDelete) => {
    setUserToDelete(userToDelete);
    setShowDeleteUserConfirm(true);
  };

  const handleDeleteUser = async () => {
    setLoadingUsers(true);

    try {
      await userApi.deleteUser(userToDelete.id);
      success('User deleted successfully!');
      setShowDeleteUserConfirm(false);
      setUserToDelete(null);
      
      // Reload users to get the updated list
      await loadUsers();
    } catch (err) {
      error(err.message || 'Failed to delete user');
      setShowDeleteUserConfirm(false);
    }

    setLoadingUsers(false);
  };

  const roles = [
    { value: 'Doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { value: 'Nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { value: 'Lab Technician', label: 'Lab Technician', icon: '🔬' },
    { value: 'Pharmacist', label: 'Pharmacist', icon: '💊' },
    { value: 'Administrator', label: 'Administrator', icon: '👤' },
    { value: 'Receptionist', label: 'Receptionist', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">National Institute for Nephrology, Dialysis & Transplantation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{user?.username || 'Admin User'}</span>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : 'AU'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                activeTab === 'users' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="font-medium">User Management</span>
            </button>
            
            <button
              onClick={() => setActiveTab('departments')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                activeTab === 'departments' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium">Departments</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                activeTab === 'reports' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Reports</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header with Create User Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600">Create and manage system user accounts</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateUserForm(true);
                    setUserError('');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create User
                </button>
              </div>

              {/* Error Message */}
              {userError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {userError}
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">System Users</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loadingUsers ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                              <p className="text-gray-500">Loading users...</p>
                            </div>
                          </td>
                        </tr>
                      ) : userError ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Users</h3>
                              <p className="text-red-500 mb-4">{userError}</p>
                              <button
                                onClick={loadUsers}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Retry
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (Array.isArray(users) ? users : []).length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                              <p className="text-gray-500 mb-4">Get started by creating your first system user.</p>
                              <button
                                onClick={() => setShowCreateUserForm(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create First User
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        (Array.isArray(users) ? users : []).map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.employee_id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="mr-2">{roles.find(r => r.value === user.role)?.icon}</span>
                                <span className="text-sm text-gray-900">{user.role}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.department_name}</div>
                              {user.department_id && (
                                <div className="text-xs text-gray-500">ID: {user.department_id}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.status === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                <button 
                                  onClick={() => handleEditUser(user)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteUserClick(user)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Create User Modal */}
          {showCreateUserForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
                  <button
                    onClick={() => {
                      setShowCreateUserForm(false);
                      setUserError('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Error Messages in Modal */}
                {userError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {userError}
                  </div>
                )}

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Only letters, spaces, dots, hyphens, and apostrophes allowed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.icon} {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={newUser.departmentId}
                      onChange={(e) => setNewUser({...newUser, departmentId: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loadingDepartments}
                    >
                      <option value="">
                        {loadingDepartments ? 'Loading departments...' : 'Select Department'}
                      </option>
                      {departments.filter(dept => dept.status === 'Active').map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                      {departments.filter(dept => dept.status !== 'Active').map(dept => (
                        <option key={dept.id} value={dept.id} disabled>
                          {dept.name} (Inactive)
                        </option>
                      ))}
                    </select>
                    {departments.length === 0 && !loadingDepartments && (
                      <p className="mt-1 text-xs text-amber-600">
                        ⚠️ No departments available. Please create a department first.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newUser.employeeId}
                        onChange={(e) => setNewUser({...newUser, employeeId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., EMP001"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setNewUser({...newUser, employeeId: generateEmployeeId()})}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
                      >
                        Auto-Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Create password"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 6 characters with at least one letter and one digit
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateUserForm(false);
                        setUserError('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Department Management */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              {/* Header with Create Department Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Department Management</h2>
                  <p className="text-gray-600">Manage hospital departments and their operations</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateDepartmentForm(true);
                    setDepartmentError('');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Department
                </button>
              </div>

              {/* Error Message */}
              {departmentError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {departmentError}
                  </div>
                </div>
              )}

              {/* Departments Table */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Hospital Departments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loadingDepartments ? (
                        <tr>
                          <td colSpan="2" className="px-6 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                              </svg>
                              Loading departments...
                            </div>
                          </td>
                        </tr>
                      ) : departments.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                            No departments found. Create your first department to get started.
                          </td>
                        </tr>
                      ) : (
                        departments.map((department) => (
                          <tr key={department.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {department.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{department.name}</div>
                                  <div className="text-xs text-gray-500">
                                    Status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      department.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {department.status}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Created: {new Date(department.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                <button 
                                  onClick={() => handleEditDepartment(department)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                  disabled={loadingDepartments}
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(department)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                  disabled={loadingDepartments}
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditUserForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                  <button
                    onClick={() => {
                      setShowEditUserForm(false);
                      setEditingUser(null);
                      setUserError('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Error Messages in Modal */}
                {userError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {userError}
                  </div>
                )}

                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <input
                      type="text"
                      value={newUser.employeeId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      placeholder="Employee ID"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Employee ID cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Only letters, spaces, dots, hyphens, and apostrophes allowed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.icon} {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={newUser.departmentId}
                      onChange={(e) => setNewUser({...newUser, departmentId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password (Optional)</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Leave blank to keep current password"
                    />
                    <p className="text-xs text-gray-500 mt-1">Only enter a password if you want to change it</p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditUserForm(false);
                        setEditingUser(null);
                        setUserError('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loadingUsers}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {loadingUsers ? 'Updating...' : 'Update User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete User Confirmation Modal */}
          {showDeleteUserConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                  <button
                    onClick={() => {
                      setShowDeleteUserConfirm(false);
                      setUserToDelete(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Are you sure?</h4>
                      <p className="text-sm text-gray-500">This action cannot be undone.</p>
                    </div>
                  </div>

                  {userToDelete && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">User:</span> {userToDelete.name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Employee ID:</span> {userToDelete.employee_id}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Role:</span> {userToDelete.role}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteUserConfirm(false);
                      setUserToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={loadingUsers}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loadingUsers ? 'Deleting...' : 'Delete User'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Department Modal */}
          {showCreateDepartmentForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Department</h3>
                  <button
                    onClick={() => {
                      setShowCreateDepartmentForm(false);
                      setDepartmentError('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Error/Success Messages in Modal */}
                {departmentError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {departmentError}
                  </div>
                )}

                <form onSubmit={handleCreateDepartment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                    <input
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Cardiology, Neurology, Orthopedics"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateDepartmentForm(false);
                        setDepartmentError('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      disabled={loadingDepartments}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loadingDepartments}
                    >
                      {loadingDepartments ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Creating...
                        </div>
                      ) : (
                        'Add Department'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Department Modal */}
          {showEditDepartmentForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Department</h3>
                  <button
                    onClick={() => {
                      setShowEditDepartmentForm(false);
                      setDepartmentError('');
                      setEditingDepartment(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Error Messages in Modal */}
                {departmentError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {departmentError}
                  </div>
                )}

                <form onSubmit={handleUpdateDepartment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                    <input
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter department name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newDepartment.status}
                      onChange={(e) => setNewDepartment({ ...newDepartment, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditDepartmentForm(false);
                        setDepartmentError('');
                        setEditingDepartment(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      disabled={loadingDepartments}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loadingDepartments}
                    >
                      {loadingDepartments ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Updating...
                        </div>
                      ) : (
                        'Update Department'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Department</h3>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDepartmentToDelete(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Are you sure you want to delete this department?
                    </h4>
                    <p className="text-gray-600 mb-2">
                      Department: <span className="font-semibold">{departmentToDelete?.name}</span>
                    </p>
                    <p className="text-sm text-red-600">
                      This action cannot be undone. This will permanently delete the department and remove all related data.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDepartmentToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    disabled={loadingDepartments}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteDepartment}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loadingDepartments}
                  >
                    {loadingDepartments ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Deleting...
                      </div>
                    ) : (
                      'Delete Department'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Reports management features will be available in the next update.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}