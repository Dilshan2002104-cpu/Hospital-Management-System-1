import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Ward1ReportsApi from '../services/ward1ReportsApi';

// Ward Data Entry Components
import AdmissionsTab from '../components/WardDataEntry/AdmissionsTab';
import DischargesFlowTab from '../components/WardDataEntry/DischargesFlowTab';
import DiagnosticsTab from '../components/WardDataEntry/DiagnosticsTab';
import ReferralsTab from '../components/WardDataEntry/ReferralsTab';
import YearlyOverviewTab from '../components/WardDataEntry/YearlyOverviewTab';
import Ward1StatisticsTab from '../components/WardDataEntry/Ward1StatisticsTab';

export default function Ward1Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success, error } = useToast();

  // Monthly Data Entry State - preserve selection across refreshes
  const [selectedYear, setSelectedYear] = useState(() => {
    return parseInt(localStorage.getItem('ward1_selected_year')) || new Date().getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return parseInt(localStorage.getItem('ward1_selected_month')) || new Date().getMonth() + 1;
  });
  const [activeDataTab, setActiveDataTab] = useState(() => {
    return localStorage.getItem('ward1_active_tab') || 'overview';
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [monthlyData, setMonthlyData] = useState({
    // === ADMISSIONS ===
    totalBeds: 30, // Backend requires ge=1, default=30
    totalBedsHDU: 0, // Backend allows ge=0
    totalBedsWard: 0, // Ward 02 bed capacity
    totalBedsIsolation: 0, // Isolation bed capacity
    admissionsMale: 0,
    admissionsFemale: 0,
    admissionsAH: 0,
    admissionsAMCA: 0,
    admissionsSAMA: 0,
    
    // === ADMISSIONS BY WARD/UNIT ===
    admissionsKU: 0,
    admissionsMUNT: 0,
    admissionsWard02: 0,
    admissionsIsolation: 0,
    admissionsHDUUnit: 0,
    
    // === DISCHARGES & FLOW ===
    bedOccupancyRate: 0,
    avgLengthOfStay: 0,
    midnightTotal: 0,
    discharges: 0,
    lama: 0,
    reAdmissions: 0,
    dischargeSameDay: 0,
    transferToOtherHospitals: 0,
    transferFromOtherHospitals: 0,
    weekdayTransfersIn: 0,
    weekdayTransfersOut: 0,
    weekendTransfersIn: 0,
    weekendTransfersOut: 0,
    missing: 0,
    numberOfDeath: 0,
    deathWithin24hrs: 0,
    deathWithin48hrs: 0,
    deathRate: 0,
    
    // === DIAGNOSTICS ===
    noOfHD: 0,
    xrayInward: 0,
    xrayDepartmental: 0,
    ecgInward: 0,
    ecgDepartmental: 0,
    abg: 0,
    witMeetings: false,
    
    // === REFERRALS ===
    referralsCardiology: 0,
    referralsChestPhysician: 0,
    referralsRadiodiagnosis: 0,
    referralsHeumatology: 0,
    referralsOthers: 0,
    totalReferrals: 0,
    
    // === METADATA ===
    status: 'draft',
    lastSaved: null
  });

  // Save selections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ward1_selected_year', selectedYear.toString());
  }, [selectedYear]);

  useEffect(() => {
    localStorage.setItem('ward1_selected_month', selectedMonth.toString());
  }, [selectedMonth]);

  useEffect(() => {
    localStorage.setItem('ward1_active_tab', activeDataTab);
  }, [activeDataTab]);

  const loadExistingData = useCallback(async () => {
    try {
      setLoading(true);
      const existingData = await Ward1ReportsApi.getMonthlyReport(selectedYear, selectedMonth);
      
      console.log('Raw API data:', existingData); // Debug log
      
      if (existingData) {
        // Transform API data to frontend format
        const transformedData = Ward1ReportsApi.transformFromApiFormat(existingData);
        console.log('Transformed data:', transformedData); // Debug log
        
        // Force a complete state replacement instead of merge
        setMonthlyData({
          // Reset everything first
          totalBeds: 30,
          totalBedsHDU: 2,
          admissionsMale: 0,
          admissionsFemale: 0,
          admissionsAH: 0,
          admissionsAMCA: 0,
          admissionsSAMA: 0,
          admissionsKU: 0,
          admissionsMUNT: 0,
          admissionsWard02: 0,
          admissionsIsolation: 0,
          admissionsHDUUnit: 0,
          bedOccupancyRate: 0,
          avgLengthOfStay: 0,
          midnightTotal: 0,
          discharges: 0,
          lama: 0,
          reAdmissions: 0,
          dischargeSameDay: 0,
          transferToOtherHospitals: 0,
          transferFromOtherHospitals: 0,
          weekdayTransfersIn: 0,
          weekdayTransfersOut: 0,
          weekendTransfersIn: 0,
          weekendTransfersOut: 0,
          missing: 0,
          numberOfDeath: 0,
          deathWithin24hrs: 0,
          deathWithin48hrs: 0,
          deathRate: 0,
          noOfHD: 0,
          xrayInward: 0,
          xrayDepartmental: 0,
          ecgInward: 0,
          ecgDepartmental: 0,
          abg: 0,
          witMeetings: false,
          referralsCardiology: 0,
          referralsChestPhysician: 0,
          referralsRadiodiagnosis: 0,
          referralsHeumatology: 0,
          referralsOthers: 0,
          totalReferrals: 0,
          status: 'draft',
          lastSaved: null,
          // Then apply loaded data
          ...transformedData
        });
        
        console.log('Data loaded and UI should update'); // Debug log
        success(`Data loaded for ${selectedMonth}/${selectedYear}`);
      } else {
        // Reset to default values for new month (must match backend validation)
        setMonthlyData({
          // Ward capacity - set to minimum required values
          totalBeds: 30, // Backend requires ge=1, use default=30
          totalBedsHDU: 0, // Backend allows ge=0
          totalBedsWard: 0, // Ward 02 bed capacity
          totalBedsIsolation: 0, // Isolation bed capacity
          
          // All monthly data starts at 0
          admissionsMale: 0,
          admissionsFemale: 0,
          admissionsAH: 0,
          admissionsAMCA: 0,
          admissionsSAMA: 0,
          admissionsKU: 0,
          admissionsMUNT: 0,
          admissionsWard02: 0,
          admissionsIsolation: 0,
          admissionsHDUUnit: 0,
          bedOccupancyRate: 0,
          avgLengthOfStay: 0,
          midnightTotal: 0,
          discharges: 0,
          lama: 0,
          reAdmissions: 0,
          dischargeSameDay: 0,
          transferToOtherHospitals: 0,
          transferFromOtherHospitals: 0,
          weekdayTransfersIn: 0,
          weekdayTransfersOut: 0,
          weekendTransfersIn: 0,
          weekendTransfersOut: 0,
          missing: 0,
          numberOfDeath: 0,
          deathWithin24hrs: 0,
          deathWithin48hrs: 0,
          deathRate: 0,
          noOfHD: 0,
          xrayInward: 0,
          xrayDepartmental: 0,
          ecgInward: 0,
          ecgDepartmental: 0,
          abg: 0,
          witMeetings: false,
          referralsCardiology: 0,
          referralsChestPhysician: 0,
          referralsRadiodiagnosis: 0,
          referralsHeumatology: 0,
          referralsOthers: 0,
          totalReferrals: 0,
          status: 'draft',
          lastSaved: null
        });
        console.log(`No existing data for ${selectedMonth}/${selectedYear} - showing empty form`);
      }
    } catch (err) {
      // Only show error for unexpected errors, not for "no data found"
      if (err.response?.status !== 404) {
        console.error('Error loading data:', err);
        error('Failed to load existing data');
      } else {
        // 404 is expected when no data exists - reset form to default values
        setMonthlyData({
          // Ward capacity - set to minimum required values  
          totalBeds: 30, // Backend requires ge=1, use default=30
          totalBedsHDU: 0, // Backend allows ge=0
          totalBedsWard: 0, // Ward 02 bed capacity  
          totalBedsIsolation: 0, // Isolation bed capacity
          
          // Reset all monthly data to 0/default
          admissionsMale: 0,
          admissionsFemale: 0,
          admissionsAH: 0,
          admissionsAMCA: 0,
          admissionsSAMA: 0,
          admissionsKU: 0,
          admissionsMUNT: 0,
          admissionsWard02: 0,
          admissionsIsolation: 0,
          admissionsHDUUnit: 0,
          bedOccupancyRate: 0,
          avgLengthOfStay: 0,
          midnightTotal: 0,
          discharges: 0,
          lama: 0,
          reAdmissions: 0,
          dischargeSameDay: 0,
          transferToOtherHospitals: 0,
          transferFromOtherHospitals: 0,
          weekdayTransfersIn: 0,
          weekdayTransfersOut: 0,
          weekendTransfersIn: 0,
          weekendTransfersOut: 0,
          missing: 0,
          numberOfDeath: 0,
          deathWithin24hrs: 0,
          deathWithin48hrs: 0,
          deathRate: 0,
          noOfHD: 0,
          xrayInward: 0,
          xrayDepartmental: 0,
          ecgInward: 0,
          ecgDepartmental: 0,
          abg: 0,
          witMeetings: false,
          referralsCardiology: 0,
          referralsChestPhysician: 0,
          referralsRadiodiagnosis: 0,
          referralsHeumatology: 0,
          referralsOthers: 0,
          totalReferrals: 0,
          status: 'draft',
          lastSaved: null
        });
        console.log(`No existing data for ${selectedMonth}/${selectedYear} - ready for new entry`);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, success, error]);

  useEffect(() => {
    // Load existing data when year/month changes
    loadExistingData();
  }, [selectedYear, selectedMonth, loadExistingData]);

  const handleSaveData = async () => {
    try {
      setSaving(true);
      
      // Transform frontend data to API format
      const apiData = Ward1ReportsApi.transformToApiFormat(monthlyData, selectedYear, selectedMonth);
      console.log('Sending data to API:', JSON.stringify(apiData, null, 2)); // Debug log
      
      // Save to backend
      const response = await Ward1ReportsApi.saveMonthlyReport(apiData);
      
      // Update local state with saved timestamp
      setMonthlyData(prev => ({
        ...prev,
        lastSaved: new Date().toISOString(),
        status: 'draft'
      }));
      
      success(response.message || 'Data saved successfully!');
    } catch (err) {
      console.error('Error saving data:', err);
      console.error('Error response data:', JSON.stringify(err.response?.data, null, 2));
      
      // Handle different error types
      let errorMessage = 'Failed to save data. Please try again.';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          // Handle validation errors array
          errorMessage = err.response.data.detail.map(e => e.msg || e.message || e).join(', ');
        }
      }
      
      error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitData = async () => {
    try {
      setSaving(true);
      
      // First save the current data
      const apiData = Ward1ReportsApi.transformToApiFormat(monthlyData, selectedYear, selectedMonth);
      await Ward1ReportsApi.saveMonthlyReport(apiData);
      
      // Then submit for approval
      const submitResponse = await Ward1ReportsApi.submitMonthlyReport(
        selectedYear, 
        selectedMonth, 
        'Monthly report submitted for review'
      );
      
      // Update local state
      setMonthlyData(prev => ({
        ...prev,
        status: 'submitted',
        lastSaved: new Date().toISOString()
      }));
      
      success(submitResponse.message || 'Report submitted for approval successfully!');
    } catch (err) {
      console.error('Error submitting data:', err);
      console.error('Submit error response data:', err.response?.data);
      
      // Handle different error types
      let errorMessage = 'Failed to submit report. Please try again.';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          // Handle validation errors array
          errorMessage = err.response.data.detail.map(e => e.msg || e.message || e).join(', ');
        }
      }
      
      error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

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

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveDataTab('data-entry')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  ['overview', 'admissions', 'discharges', 'diagnostics', 'referrals'].includes(activeDataTab)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📊</span>
                Monthly Data Entry
              </button>
              
              <button
                onClick={() => setActiveDataTab('statistics')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                  activeDataTab === 'statistics'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📈</span>
                Ward 1 Statistics Report
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Month Selection Header - Only show for data entry tabs */}
          {activeDataTab !== 'statistics' && (
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month} {selectedYear}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSaveData}
                disabled={saving}
                className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 ${
                  saving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save Data</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleSubmitData}
                disabled={saving || monthlyData.status === 'submitted' || monthlyData.status === 'approved'}
                className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 ${
                  saving || monthlyData.status === 'submitted' || monthlyData.status === 'approved'
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>
                      {monthlyData.status === 'submitted' ? 'Submitted' : 
                       monthlyData.status === 'approved' ? 'Approved' : 'Submit'}
                    </span>
                  </>
                )}
              </button>
            </div>
            
            {/* Status indicator */}
            {monthlyData.status && (
              <div className="flex items-center space-x-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  monthlyData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  monthlyData.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                  monthlyData.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {monthlyData.status.charAt(0).toUpperCase() + monthlyData.status.slice(1)}
                </span>
                {monthlyData.lastSaved && (
                  <span className="text-gray-500">
                    Last saved: {new Date(monthlyData.lastSaved).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
          )}

          {/* Main Content Area */}
          {activeDataTab === 'statistics' ? (
            /* Statistics Report View */
            <Ward1StatisticsTab 
              selectedYear={selectedYear}
              disabled={false}
            />
          ) : (
            /* Data Entry Tabs */
            loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading monthly data...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Yearly Overview', icon: '📅' },
                    { id: 'admissions', name: 'Admissions', icon: '🏥' },
                    { id: 'discharges', name: 'Discharges', icon: '📊' },
                    { id: 'referrals', name: 'Referrals', icon: '👨‍⚕️' },
                    { id: 'diagnostics', name: 'Diagnostics', icon: '🔬' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDataTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                        activeDataTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeDataTab === 'overview' && (
                  <YearlyOverviewTab 
                    selectedYear={selectedYear}
                    onNavigateToMonth={(month) => {
                      setSelectedMonth(month);
                      setActiveDataTab('admissions'); // Switch to admissions tab when navigating to a month
                    }}
                    disabled={false}
                  />
                )}

                {activeDataTab === 'admissions' && (
                  <AdmissionsTab 
                    key={`admissions-${selectedYear}-${selectedMonth}`}
                    data={monthlyData} 
                    updateData={(field, value) => setMonthlyData(prev => ({ ...prev, [field]: value }))}
                    disabled={false}
                  />
                )}
                
                {activeDataTab === 'discharges' && (
                  <DischargesFlowTab 
                    key={`discharges-${selectedYear}-${selectedMonth}`}
                    data={monthlyData} 
                    updateData={(field, value) => setMonthlyData(prev => ({ ...prev, [field]: value }))}
                    disabled={false}
                  />
                )}
                
                {activeDataTab === 'diagnostics' && (
                  <DiagnosticsTab 
                    key={`diagnostics-${selectedYear}-${selectedMonth}`}
                    data={monthlyData} 
                    updateData={(field, value) => setMonthlyData(prev => ({ ...prev, [field]: value }))}
                    disabled={false}
                  />
                )}
                
                {activeDataTab === 'referrals' && (
                  <ReferralsTab 
                    key={`referrals-${selectedYear}-${selectedMonth}`}
                    data={monthlyData} 
                    updateData={(field, value) => setMonthlyData(prev => ({ ...prev, [field]: value }))}
                    disabled={false}
                  />
                )}
              </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}