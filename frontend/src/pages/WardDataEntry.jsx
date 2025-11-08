import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

// Tab Components (will create these next)
import AdmissionsTab from '../components/WardDataEntry/AdmissionsTab';
import DischargesFlowTab from '../components/WardDataEntry/DischargesFlowTab';
import DiagnosticsTab from '../components/WardDataEntry/DiagnosticsTab';
import ReferralsTab from '../components/WardDataEntry/ReferralsTab';
import OutcomesTab from '../components/WardDataEntry/OutcomesTab';

export default function WardDataEntry() {
  const { wardId, year, month } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('admissions');
  const [wardName, setWardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    // === ADMISSIONS ===
    totalBedsWard: 24,
    totalBedsIsolation: 4,
    totalBedsHDU: 2,
    admissionsMale: 0,
    admissionsFemale: 0,
    admissionsAH: 0,
    admissionsAMCA: 0,
    admissionsSAMA: 0,
    
    // === DISCHARGES & FLOW ===
    bedOccupancyRate: 0,
    avgLengthOfStay: 0,
    midnightTotal: 0,
    discharges: 0,
    lama: 0,
    reAdmissions: 0,
    
    // === REFERRALS ===
    referralsCardiology: 0,
    referralsChestPhysician: 0,
    referralsRadiodiagnosis: 0,
    referralsHeumatology: 0,
    referralsOthers: 0,
    
    // === DIAGNOSTICS ===
    noOfHD: 0,
    xrayInward: 0,
    xrayDepartmental: 0,
    ecgInward: 0,
    ecgDepartmental: 0,
    abg: 0,
    witMeetings: false,
    
    // === OUTCOMES ===
    deathsMale: 0,
    deathsFemale: 0,
    
    // === METADATA ===
    status: 'draft',
    lastSaved: null
  });

  // Tab configuration
  const tabs = [
    {
      id: 'admissions',
      name: 'Admissions',
      icon: '🏥',
      component: AdmissionsTab,
      description: 'Bed capacity and patient admissions data'
    },
    {
      id: 'discharges',
      name: 'Discharges & Flow',
      icon: '📊',
      component: DischargesFlowTab,
      description: 'Occupancy rates, discharges, and patient flow'
    },
    {
      id: 'diagnostics',
      name: 'Diagnostics',
      icon: '🔬',
      component: DiagnosticsTab,
      description: 'Diagnostic procedures and tests performed'
    },
    {
      id: 'referrals',
      name: 'Referrals',
      icon: '👨‍⚕️',
      component: ReferralsTab,
      description: 'Patient referrals to specialists'
    },
    {
      id: 'outcomes',
      name: 'Outcomes',
      icon: '📈',
      component: OutcomesTab,
      description: 'Patient outcomes and mortality data'
    }
  ];

  // Get month name
  const getMonthName = (monthNum) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[parseInt(monthNum) - 1] || 'Unknown';
  };

  // Load existing data or create new
  const loadWardData = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to load existing data
      // For now, just set ward name from departments
      setWardName(`Ward ${wardId}`); // Temporary
    } catch (err) {
      console.error('Failed to load ward data', err);
      error('Failed to load ward data');
    } finally {
      setLoading(false);
    }
  }, [wardId, error]);

  useEffect(() => {
    loadWardData();
  }, [loadWardData]);

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-save functionality
  const autoSave = async () => {
    try {
      setSaving(true);
      // TODO: Implement auto-save API call
      setFormData(prev => ({
        ...prev,
        lastSaved: new Date()
      }));
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  // Save as draft
  const saveDraft = async () => {
    try {
      setSaving(true);
      await autoSave();
      success('Data saved as draft');
    } catch (err) {
      console.error('Failed to save data', err);
      error('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  // Submit for review
  const submitForReview = async () => {
    try {
      setSaving(true);
      // TODO: Implement submit API call
      setFormData(prev => ({
        ...prev,
        status: 'submitted'
      }));
      success('Data submitted for review');
    } catch (err) {
      console.error('Failed to submit data', err);
      error('Failed to submit data');
    } finally {
      setSaving(false);
    }
  };

  // Get current tab component
  const getCurrentTabComponent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab) return null;
    
    const TabComponent = currentTab.component;
    return (
      <TabComponent
        data={formData}
        updateData={updateFormData}
        disabled={formData.status !== 'draft'}
      />
    );
  };

  // Calculated values
  const totalAdmissions = (formData.admissionsMale || 0) + (formData.admissionsFemale || 0);
  const totalReferrals = (formData.referralsCardiology || 0) + 
                        (formData.referralsChestPhysician || 0) + 
                        (formData.referralsRadiodiagnosis || 0) + 
                        (formData.referralsHeumatology || 0) + 
                        (formData.referralsOthers || 0);
  const totalDeaths = (formData.deathsMale || 0) + (formData.deathsFemale || 0);
  const deathRate = formData.discharges > 0 ? 
                   ((totalDeaths || 0) / formData.discharges * 100).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ward data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/ward-data-selector')}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-blue-600">
                📊 {wardName} - {getMonthName(month)} {year}
              </h1>
              <p className="text-sm text-gray-600">Monthly Medical Statistics Data Entry</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              formData.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
              formData.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
            </span>
            
            {/* Auto-save indicator */}
            {saving && (
              <div className="flex items-center text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Saving...
              </div>
            )}
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Tab Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.icon} {tabs.find(tab => tab.id === activeTab)?.name}
            </h2>
            <p className="text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>

          {/* Dynamic Tab Component */}
          {getCurrentTabComponent()}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {formData.lastSaved && (
              <span>Last saved: {formData.lastSaved.toLocaleTimeString()}</span>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={saveDraft}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Save Draft
            </button>
            
            {formData.status === 'draft' && (
              <button
                onClick={submitForReview}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                Submit for Review
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{totalAdmissions}</div>
              <div className="text-sm text-blue-700">Total Admissions</div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">{totalReferrals}</div>
              <div className="text-sm text-green-700">Total Referrals</div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-900">{deathRate}%</div>
              <div className="text-sm text-red-700">Death Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}