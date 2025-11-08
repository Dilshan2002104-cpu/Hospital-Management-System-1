import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/useToast';
import Ward1ReportsApi from '../../services/ward1ReportsApi';

export default function Ward1StatisticsTab({ selectedYear }) {
  const { success, error } = useToast();
  
  // Form state matching the exact table structure
  const [formData, setFormData] = useState({
    // Header fields
    month: new Date().getMonth() + 1,
    year: selectedYear,
    
    // Table data fields (initially empty, will be loaded from database)
    totalMale: 0,
    totalFemale: 0,
    totalDischarge: 0,
    transferInWeekdays: 0,
    transferInWeekends: 0,
    transferOutWeekdays: 0,
    transferOutWeekends: 0,
    totalDeath: 0,
    deathsWithin48Hours: 0,
    sameDay: 0,
    readmissions: 0,
    endOfMonth: 0,
    totalXRay: 0,
    totalECG: 0
  });

  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Month options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Year options (previous 4 years, current year, and next year)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 4; year <= currentYear + 1; year++) {
    years.push({ value: year, label: year.toString() });
  }

  // Update year when selectedYear prop changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, year: selectedYear }));
  }, [selectedYear]);

  // Fetch monthly report data from database
  const fetchMonthlyReport = useCallback(async (year, month) => {
    setLoading(true);
    setHasData(false);
    
    try {
      const response = await Ward1ReportsApi.getMonthlyReport(year, month);
      
      // Debug: Log the actual response structure
      console.log('Ward1StatisticsTab - API Response:', response);
      
      // Handle case where no data exists (404 returns null)
      if (!response) {
        console.log('Ward1StatisticsTab - No response (404)');
        setHasData(false);
        return; // Don't show error message for missing data
      }
      
      if (response && (response.year || response.id)) {
        console.log('Ward1StatisticsTab - Found data:', response);
        const reportData = response;
        
        // Map database fields to statistics table fields
        setFormData(prev => ({
          ...prev,
          // Admissions data
          totalMale: reportData.admissions_male || 0,
          totalFemale: reportData.admissions_female || 0,
          
          // Discharges
          totalDischarge: reportData.discharges || 0,
          
          // Transfers
          transferInWeekdays: reportData.weekday_transfers_in || 0,
          transferInWeekends: reportData.weekend_transfers_in || 0,
          transferOutWeekdays: reportData.weekday_transfers_out || 0,
          transferOutWeekends: reportData.weekend_transfers_out || 0,
          
          // Deaths
          totalDeath: reportData.number_of_death || 0,
          deathsWithin48Hours: reportData.death_within_48hrs || 0,
          
          // Other metrics
          sameDay: reportData.discharge_same_day || 0,
          readmissions: reportData.re_admissions || 0,
          endOfMonth: reportData.midnight_total || 0,
          
          // Diagnostics
          totalXRay: (reportData.xray_inward || 0) + (reportData.xray_departmental || 0),
          totalECG: (reportData.ecg_inward || 0) + (reportData.ecg_departmental || 0)
        }));
        
        setHasData(true);
        success('Monthly report data loaded successfully');
      } else {
        console.log('Ward1StatisticsTab - Invalid response structure:', response);
        setHasData(false);
      }
    } catch (err) {
      console.error('Error fetching monthly report:', err);
      setHasData(false);
      // Only show error toast for non-404 errors
      if (err.response?.status !== 404) {
        error('Failed to load monthly report data. Please check if data exists for this period.');
      }
    } finally {
      setLoading(false);
    }
  }, [success, error]);

  // Fetch data when month or year changes
  useEffect(() => {
    if (formData.month && formData.year) {
      fetchMonthlyReport(formData.year, formData.month);
    }
  }, [formData.month, formData.year, fetchMonthlyReport]);

  // Handle dropdown changes for month/year selection
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Smart calculations (computed values) - exactly like the table
  const totalAdmissions = formData.totalMale + formData.totalFemale;
  const totalTransferIn = formData.transferInWeekdays + formData.transferInWeekends;
  const totalTransferOut = formData.transferOutWeekdays + formData.transferOutWeekends;



  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ward 1 Statistics Report</h2>
          <p className="text-gray-600 mt-1">Automatically populated from monthly data entry forms</p>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header Information */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ward 1 Statistics Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={formData.month}
                onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {years.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="mt-2 text-gray-600">Loading monthly report data...</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && !hasData && (
          <div className="p-6 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              No monthly report data found for {months.find(m => m.value === formData.month)?.label} {formData.year}.
              <br />
              Please ensure the monthly data has been entered through the data entry forms.
            </p>
          </div>
        )}

        {/* Statistics Table - Exact format as requested */}
        {!loading && hasData && (
          <div className="p-6">
            <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">No.</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1: Total No of Admission */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">1</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Total No of Admission</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold text-blue-600">{totalAdmissions}</td>
                </tr>
                
                {/* Row 2: Male */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">2</td>
                  <td className="border border-gray-300 px-4 py-2">1. Total of Male</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.totalMale}</td>
                </tr>
                
                {/* Row 2.2: Female */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2">2. Total of Female</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.totalFemale}</td>
                </tr>
                
                {/* Row 3: Total No of Discharge */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">3</td>
                  <td className="border border-gray-300 px-4 py-2">Total No of Discharge</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.totalDischarge}</td>
                </tr>
                
                {/* Row 4: Total No of Transfer In */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">4</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Total No of Transfer In</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold text-blue-600">{totalTransferIn}</td>
                </tr>
                
                {/* Row 4.1: Weekdays */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2">Weekdays</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.transferInWeekdays}</td>
                </tr>
                
                {/* Row 4.2: Weekends */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2">Weekends</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.transferInWeekends}</td>
                </tr>
                
                {/* Row 5: Total No of Transfer Out */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">5</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Total No of Transfer Out</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold text-blue-600">{totalTransferOut}</td>
                </tr>
                
                {/* Row 5.1: Weekdays */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2">Weekdays</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.transferOutWeekdays}</td>
                </tr>
                
                {/* Row 5.2: Weekends */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2">Weekends</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.transferOutWeekends}</td>
                </tr>
                
                {/* Row 6: Total No of Death */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">6</td>
                  <td className="border border-gray-300 px-4 py-2">Total No of Death</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.totalDeath}</td>
                </tr>
                
                {/* Row 7: Deaths within 48 hours */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">7</td>
                  <td className="border border-gray-300 px-4 py-2">Number of deaths occurred within 48 hours of admission to the hospital</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.deathsWithin48Hours || '-'}</td>
                </tr>
                
                {/* Row 8: Same day */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">8</td>
                  <td className="border border-gray-300 px-4 py-2">Number Admitted and Discharged the same day (Including deaths)</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.sameDay}</td>
                </tr>
                
                {/* Row 9: Readmission */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">9</td>
                  <td className="border border-gray-300 px-4 py-2">Total No of Readmission</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.readmissions || '-'}</td>
                </tr>
                
                {/* Row 10: End of Month */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">10</td>
                  <td className="border border-gray-300 px-4 py-2">Total No. of the Patients at the end of Month</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.endOfMonth}</td>
                </tr>
                
                {/* Row 11: X-Ray */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">11</td>
                  <td className="border border-gray-300 px-4 py-2">Total No of X-Ray</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.totalXRay}</td>
                </tr>
                
                {/* Row 12: ECG */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">12</td>
                  <td className="border border-gray-300 px-4 py-2">Total No of ECG</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{formData.totalECG}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Summary Section */}
        {!loading && hasData && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <h4 className="text-md font-semibold text-gray-900 mb-3">📋 Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <span className="font-medium">Total Admissions:</span>
              <span className="ml-2 text-indigo-600 font-bold">{totalAdmissions}</span>
            </div>
            <div className="bg-white p-3 rounded border">
              <span className="font-medium">Total Transfer In:</span>
              <span className="ml-2 text-indigo-600 font-bold">{totalTransferIn}</span>
            </div>
            <div className="bg-white p-3 rounded border">
              <span className="font-medium">Total Transfer Out:</span>
              <span className="ml-2 text-indigo-600 font-bold">{totalTransferOut}</span>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}