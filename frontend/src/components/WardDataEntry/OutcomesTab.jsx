import React from 'react';

export default function OutcomesTab({ data, updateData, disabled }) {
  const handleInputChange = (field, value) => {
    updateData(field, value);
  };

  // Calculate mortality rates and percentages
  const totalDeaths = (data.deathsMale || 0) + (data.deathsFemale || 0);
  const totalDischarges = data.discharges || 0;
  const totalAdmissions = data.totalAdmissions || 0;
  
  const mortalityRateDischarges = totalDischarges > 0 ? (totalDeaths / totalDischarges * 100) : 0;
  const mortalityRateAdmissions = totalAdmissions > 0 ? (totalDeaths / totalAdmissions * 100) : 0;

  // Death categories for analysis
  const deathCategories = [
    {
      field: 'deathsMale',
      label: 'Male Deaths',
      icon: '👨',
      color: 'blue'
    },
    {
      field: 'deathsFemale', 
      label: 'Female Deaths',
      icon: '👩',
      color: 'pink'
    }
  ];

  // Severity levels based on mortality rate
  const getMortalitySeverity = (rate) => {
    if (rate <= 2) return { level: 'Low', color: 'green', icon: '✅' };
    if (rate <= 5) return { level: 'Normal', color: 'yellow', icon: '⚠️' };
    if (rate <= 10) return { level: 'High', color: 'orange', icon: '🔶' };
    return { level: 'Critical', color: 'red', icon: '🚨' };
  };

  const dischargeMortality = getMortalitySeverity(mortalityRateDischarges);
  const admissionMortality = getMortalitySeverity(mortalityRateAdmissions);

  return (
    <div className="space-y-8">
      {/* Outcomes Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📊 Patient Outcomes & Mortality
        </h3>
        <p className="text-gray-600 mb-6">
          Record patient death statistics and monitor mortality rates for quality assessment.
        </p>
      </div>

      {/* Death Count Inputs */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
          💔 Death Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deathCategories.map((category) => (
            <div key={category.field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
              </label>
              <input
                type="number"
                min="0"
                value={data[category.field] || ''}
                onChange={(e) => handleInputChange(category.field, parseInt(e.target.value) || 0)}
                disabled={disabled}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${category.color}-500 focus:border-${category.color}-500 text-lg text-center font-semibold disabled:bg-gray-50`}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Total Deaths Summary */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Total Deaths</h3>
          <div className="text-4xl font-bold text-red-700 mb-2">{totalDeaths}</div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-red-600">Male Deaths</div>
              <div className="text-xl font-semibold text-red-700">{data.deathsMale || 0}</div>
            </div>
            <div>
              <div className="text-sm text-red-600">Female Deaths</div>
              <div className="text-xl font-semibold text-red-700">{data.deathsFemale || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mortality Rate Analysis */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
          📈 Mortality Rate Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mortality vs Discharges */}
          <div className={`bg-${dischargeMortality.color}-50 border border-${dischargeMortality.color}-200 rounded-lg p-6`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-lg">{dischargeMortality.icon}</span>
                <h4 className={`text-lg font-semibold text-${dischargeMortality.color}-900`}>
                  Discharge Mortality Rate
                </h4>
              </div>
              <div className={`text-3xl font-bold text-${dischargeMortality.color}-700 mb-2`}>
                {mortalityRateDischarges.toFixed(2)}%
              </div>
              <div className={`text-sm text-${dischargeMortality.color}-600`}>
                {totalDeaths} deaths out of {totalDischarges} total discharges
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-${dischargeMortality.color}-800 bg-${dischargeMortality.color}-100 mt-2`}>
                {dischargeMortality.level} Risk
              </div>
            </div>
          </div>

          {/* Mortality vs Admissions */}
          <div className={`bg-${admissionMortality.color}-50 border border-${admissionMortality.color}-200 rounded-lg p-6`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-lg">{admissionMortality.icon}</span>
                <h4 className={`text-lg font-semibold text-${admissionMortality.color}-900`}>
                  Admission Mortality Rate
                </h4>
              </div>
              <div className={`text-3xl font-bold text-${admissionMortality.color}-700 mb-2`}>
                {mortalityRateAdmissions.toFixed(2)}%
              </div>
              <div className={`text-sm text-${admissionMortality.color}-600`}>
                {totalDeaths} deaths out of {totalAdmissions} total admissions
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-${admissionMortality.color}-800 bg-${admissionMortality.color}-100 mt-2`}>
                {admissionMortality.level} Risk
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gender Distribution */}
      {totalDeaths > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
            👥 Death Distribution by Gender
          </h4>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              {deathCategories.map((category) => {
                const count = data[category.field] || 0;
                const percentage = totalDeaths > 0 ? (count / totalDeaths * 100) : 0;
                
                if (count === 0) return null;
                
                return (
                  <div key={category.field} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.label}</div>
                        <div className="text-xs text-gray-500">{count} deaths</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${category.color}-500 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quality Indicators */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
          🎯 Quality Indicators
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Survival Rate */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-green-800 mb-1">Survival Rate</div>
              <div className="text-lg font-bold text-green-700">
                {totalDischarges > 0 ? (100 - mortalityRateDischarges).toFixed(1) : 100}%
              </div>
              <div className="text-sm text-green-600">
                of discharged patients
              </div>
            </div>
          </div>

          {/* Case Fatality */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-red-800 mb-1">Case Fatality</div>
              <div className="text-lg font-bold text-red-700">
                {mortalityRateAdmissions.toFixed(1)}%
              </div>
              <div className="text-sm text-red-600">
                of total admissions
              </div>
            </div>
          </div>

          {/* Gender Ratio */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-purple-800 mb-1">Male:Female Ratio</div>
              <div className="text-lg font-bold text-purple-700">
                {data.deathsFemale > 0 
                  ? `${((data.deathsMale || 0) / data.deathsFemale).toFixed(1)}:1`
                  : `${data.deathsMale || 0}:0`}
              </div>
              <div className="text-sm text-purple-600">
                death ratio
              </div>
            </div>
          </div>

          {/* Outcome Score */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-blue-800 mb-1">Outcome Score</div>
              <div className="text-lg font-bold text-blue-700">
                {totalDischarges > 0 ? Math.max(0, 100 - (mortalityRateDischarges * 10)).toFixed(0) : 100}
              </div>
              <div className="text-sm text-blue-600">
                quality index
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mortality Rate Benchmarks */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">📋 Mortality Rate Benchmarks</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-green-100 border border-green-300 rounded p-3 text-center">
            <div className="font-semibold text-green-800">Excellent</div>
            <div className="text-green-700">≤ 2%</div>
            <div className="text-xs text-green-600 mt-1">Low mortality</div>
          </div>
          <div className="bg-yellow-100 border border-yellow-300 rounded p-3 text-center">
            <div className="font-semibold text-yellow-800">Normal</div>
            <div className="text-yellow-700">2.1% - 5%</div>
            <div className="text-xs text-yellow-600 mt-1">Expected range</div>
          </div>
          <div className="bg-orange-100 border border-orange-300 rounded p-3 text-center">
            <div className="font-semibold text-orange-800">High</div>
            <div className="text-orange-700">5.1% - 10%</div>
            <div className="text-xs text-orange-600 mt-1">Needs attention</div>
          </div>
          <div className="bg-red-100 border border-red-300 rounded p-3 text-center">
            <div className="font-semibold text-red-800">Critical</div>
            <div className="text-red-700">&gt; 10%</div>
            <div className="text-xs text-red-600 mt-1">Immediate review</div>
          </div>
        </div>
      </div>

      {/* Data Quality Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-amber-800">Mortality Data Guidelines</h4>
            <ul className="text-sm text-amber-700 mt-1 space-y-1">
              <li>• Record only deaths that occurred during the ward stay</li>
              <li>• Include deaths within 24 hours of admission</li>
              <li>• Ensure accurate gender classification</li>
              <li>• High mortality rates may indicate need for clinical review</li>
              <li>• Compare rates with previous months to identify trends</li>
              <li>• Consider case mix and severity when interpreting rates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Understanding Outcome Metrics</h4>
            <p className="text-sm text-blue-700 mt-1">
              Mortality rates are important quality indicators that help assess patient care outcomes. 
              These statistics should be reviewed regularly with clinical teams to identify improvement 
              opportunities and ensure optimal patient care delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}