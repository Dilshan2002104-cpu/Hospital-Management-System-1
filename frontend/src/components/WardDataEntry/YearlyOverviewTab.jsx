import React, { useState, useEffect } from 'react';
import Ward1ReportsApi from '../../services/ward1ReportsApi';

export default function YearlyOverviewTab({ selectedYear, onNavigateToMonth, disabled }) {
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load yearly data when component mounts or year changes
  useEffect(() => {
    loadYearlyData();
  }, [selectedYear]);

  const loadYearlyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all monthly reports for the selected year
      const reports = await Ward1ReportsApi.getMonthlyReportsByYear(selectedYear);
      
      // Create array for all 12 months with their completion status
      const monthsData = monthNames.map((monthName, index) => {
        const monthNumber = index + 1;
        const existingReport = reports.find(report => report.month === monthNumber);
        
        return {
          month: monthNumber,
          monthName,
          hasData: !!existingReport,
          status: existingReport?.status || null,
          lastUpdated: existingReport?.updated_at || null,
          totalAdmissions: existingReport?.total_admissions || 0,
          totalDischarges: existingReport?.discharges || 0,
          bedOccupancyRate: existingReport?.bed_occupancy_rate || 0,
          reportData: existingReport
        };
      });
      
      setYearlyData(monthsData);
    } catch (err) {
      console.error('Error loading yearly data:', err);
      setError('Failed to load yearly overview data');
      
      // Create empty data structure on error
      const emptyData = monthNames.map((monthName, index) => ({
        month: index + 1,
        monthName,
        hasData: false,
        status: null,
        lastUpdated: null,
        totalAdmissions: 0,
        totalDischarges: 0,
        bedOccupancyRate: 0,
        reportData: null
      }));
      
      setYearlyData(emptyData);
    } finally {
      setLoading(false);
    }
  };

  // Get status badge styling
  const getStatusBadge = (hasData, status) => {
    if (!hasData) {
      return {
        text: 'Not Started',
        className: 'bg-gray-100 text-gray-700 border border-gray-300'
      };
    }

    switch (status) {
      case 'draft':
        return {
          text: 'Draft',
          className: 'bg-yellow-100 text-yellow-800 border border-yellow-300'
        };
      case 'submitted':
        return {
          text: 'Submitted',
          className: 'bg-blue-100 text-blue-800 border border-blue-300'
        };
      case 'approved':
        return {
          text: 'Approved',
          className: 'bg-green-100 text-green-800 border border-green-300'
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-700 border border-gray-300'
        };
    }
  };

  // Calculate completion statistics
  const stats = {
    total: 12,
    completed: yearlyData.filter(month => month.hasData).length,
    submitted: yearlyData.filter(month => month.status === 'submitted').length,
    approved: yearlyData.filter(month => month.status === 'approved').length,
    draft: yearlyData.filter(month => month.status === 'draft').length,
    notStarted: yearlyData.filter(month => !month.hasData).length
  };

  const completionPercentage = ((stats.completed / stats.total) * 100).toFixed(1);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading yearly overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Year Summary Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            📊 Ward 1 Annual Report - {selectedYear}
          </h2>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
            <div className="text-sm text-gray-600">Submitted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
            <div className="text-sm text-gray-600">Draft</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
            <div className="text-sm text-gray-600">Not Started</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Months</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Monthly Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {yearlyData.map((monthData) => {
          const statusBadge = getStatusBadge(monthData.hasData, monthData.status);
          
          return (
            <div
              key={monthData.month}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                monthData.hasData 
                  ? 'border-indigo-200 bg-white hover:border-indigo-400' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-400'
              }`}
              onClick={() => onNavigateToMonth && onNavigateToMonth(monthData.month)}
            >
              {/* Month Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  {monthData.monthName} {selectedYear}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.className}`}>
                  {statusBadge.text}
                </span>
              </div>

              {/* Month Details */}
              {monthData.hasData ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Admissions</div>
                      <div className="font-semibold text-green-600">{monthData.totalAdmissions}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Discharges</div>
                      <div className="font-semibold text-blue-600">{monthData.totalDischarges}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-600">Occupancy Rate</div>
                    <div className="font-semibold text-purple-600">{monthData.bedOccupancyRate}%</div>
                  </div>
                  {monthData.lastUpdated && (
                    <div className="text-xs text-gray-500 border-t pt-2">
                      Last updated: {new Date(monthData.lastUpdated).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-400 mb-2">
                    📝
                  </div>
                  <div className="text-sm text-gray-600">
                    No data entered
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Click to start entry
                  </div>
                </div>
              )}

              {/* Action Indicator */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 flex items-center justify-center">
                  <span className="mr-1">👆</span>
                  Click to {monthData.hasData ? 'edit' : 'create'} report
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadYearlyData()}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm"
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={() => {
              const nextEmptyMonth = yearlyData.find(month => !month.hasData);
              if (nextEmptyMonth && onNavigateToMonth) {
                onNavigateToMonth(nextEmptyMonth.month);
              }
            }}
            disabled={stats.notStarted === 0}
            className={`px-3 py-2 rounded-md transition text-sm ${
              stats.notStarted === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            📝 Next Empty Month
          </button>
          <button
            onClick={() => {
              const draftMonth = yearlyData.find(month => month.status === 'draft');
              if (draftMonth && onNavigateToMonth) {
                onNavigateToMonth(draftMonth.month);
              }
            }}
            disabled={stats.draft === 0}
            className={`px-3 py-2 rounded-md transition text-sm ${
              stats.draft === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            ✏️ Continue Draft
          </button>
        </div>
      </div>
    </div>
  );
}