import React from 'react';

export default function DiagnosticsTab({ data, updateData, disabled }) {
  const handleInputChange = (field, value) => {
    updateData(field, value);
  };

  const handleCheckboxChange = (field, checked) => {
    updateData(field, checked);
  };

  return (
    <div className="space-y-8">
      {/* Hemodialysis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🩺 Hemodialysis Procedures
        </h3>
        <div className="max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No. of HD (Hemodialysis)
            </label>
            <input
              type="number"
              min="0"
              value={data.noOfHD || ''}
              onChange={(e) => handleInputChange('noOfHD', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Total hemodialysis procedures performed</p>
          </div>
        </div>
      </div>

      {/* X-Ray Procedures */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🔬 X-Ray Procedures
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              X-RAY (Inward)
            </label>
            <input
              type="number"
              min="0"
              value={data.xrayInward || ''}
              onChange={(e) => handleInputChange('xrayInward', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="13"
            />
            <p className="text-xs text-gray-500 mt-1">X-rays for inward patients</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              X-RAY (Departmental)
            </label>
            <input
              type="number"
              min="0"
              value={data.xrayDepartmental || ''}
              onChange={(e) => handleInputChange('xrayDepartmental', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="69"
            />
            <p className="text-xs text-gray-500 mt-1">Departmental X-ray procedures</p>
          </div>
        </div>
      </div>

      {/* ECG Procedures */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          💓 ECG Procedures
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ECG (Inward)
            </label>
            <input
              type="number"
              min="0"
              value={data.ecgInward || ''}
              onChange={(e) => handleInputChange('ecgInward', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="09"
            />
            <p className="text-xs text-gray-500 mt-1">ECGs for inward patients</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ECG (Departmental)
            </label>
            <input
              type="number"
              min="0"
              value={data.ecgDepartmental || ''}
              onChange={(e) => handleInputChange('ecgDepartmental', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Departmental ECG procedures</p>
          </div>
        </div>
      </div>

      {/* Other Diagnostic Tests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🧪 Laboratory & Other Tests
        </h3>
        <div className="max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ABG (Arterial Blood Gas)
            </label>
            <input
              type="number"
              min="0"
              value={data.abg || ''}
              onChange={(e) => handleInputChange('abg', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="01"
            />
            <p className="text-xs text-gray-500 mt-1">Arterial blood gas analyses</p>
          </div>
        </div>
      </div>

      {/* Ward Improvement Team Meetings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          👥 Quality Improvement
        </h3>
        <div className="max-w-md">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="witMeetings"
              checked={data.witMeetings || false}
              onChange={(e) => handleCheckboxChange('witMeetings', e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
            />
            <label htmlFor="witMeetings" className="text-sm font-medium text-gray-700">
              WIT MEETINGS (Ward Improvement Team)
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2 ml-8">
            Check if Ward Improvement Team meetings were conducted this month
          </p>
          {data.witMeetings && (
            <div className="mt-2 ml-8 text-sm text-green-600 font-medium">
              ✓ WIT meetings conducted this month
            </div>
          )}
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Diagnostic Data Guidelines</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Record all diagnostic procedures performed in the ward</li>
              <li>• Separate inward vs departmental procedures for tracking</li>
              <li>• ABG tests are critical care indicators</li>
              <li>• WIT meetings support quality improvement initiatives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}