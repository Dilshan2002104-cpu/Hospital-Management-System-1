import React from 'react';

export default function ReferralsTab({ data, updateData, disabled }) {
  const handleInputChange = (field, value) => {
    updateData(field, value);
  };

  // Calculate total referrals automatically
  const totalReferrals = (data.referralsCardiology || 0) + 
                        (data.referralsChestPhysician || 0) + 
                        (data.referralsRadiodiagnosis || 0) + 
                        (data.referralsHeumatology || 0) + 
                        (data.referralsOthers || 0);

  // Referral specialties data
  const referralTypes = [
    {
      field: 'referralsCardiology',
      label: 'Cardiology',
      icon: '❤️',
      description: 'Heart and cardiovascular system',
      color: 'red'
    },
    {
      field: 'referralsChestPhysician',
      label: 'Chest Physician',
      icon: '🫁',
      description: 'Respiratory and pulmonary conditions',
      color: 'blue'
    },
    {
      field: 'referralsRadiodiagnosis',
      label: 'Radiodiagnosis',
      icon: '🔬',
      description: 'Medical imaging and diagnostics',
      color: 'green'
    },
    {
      field: 'referralsHeumatology',
      label: 'Hematology',
      icon: '🩸',
      description: 'Blood disorders and related conditions',
      color: 'purple'
    },
    {
      field: 'referralsOthers',
      label: 'Others',
      icon: '👨‍⚕️',
      description: 'Other specialties not listed above',
      color: 'gray'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Referrals Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          👨‍⚕️ Patient Referrals to Specialists
        </h3>
        <p className="text-gray-600 mb-6">
          Record the number of patients referred to various specialist departments during this month.
        </p>
      </div>

      {/* Referral Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referralTypes.map((type) => (
          <div key={type.field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <span className="text-lg">{type.icon}</span>
              <span>{type.label}</span>
            </label>
            <input
              type="number"
              min="0"
              value={data[type.field] || ''}
              onChange={(e) => handleInputChange(type.field, parseInt(e.target.value) || 0)}
              disabled={disabled}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${type.color}-500 focus:border-${type.color}-500 text-lg text-center font-semibold disabled:bg-gray-50`}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">{type.description}</p>
          </div>
        ))}
        
        {/* Total Referrals */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <span className="text-lg">📋</span>
            <span>Total</span>
          </label>
          <input
            type="number"
            min="0"
            value={totalReferrals}
            readOnly
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-lg text-center font-semibold cursor-not-allowed"
            placeholder="0"
          />
          <p className="text-xs text-gray-500">Auto-calculated total referrals</p>
        </div>
      </div>

      {/* Referral Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-amber-800">Referral Guidelines</h4>
            <ul className="text-sm text-amber-700 mt-1 space-y-1">
              <li>• Record only patients referred during this specific month</li>
              <li>• Count each patient only once per specialty</li>
              <li>• Use "Others" category for specialties not listed</li>
              <li>• High referral rates may indicate complex cases or training needs</li>
              <li>• Track patterns to identify common conditions requiring specialist care</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Understanding Referral Data</h4>
            <p className="text-sm text-blue-700 mt-1">
              Referral patterns help identify patient care needs, specialist availability, and 
              opportunities for ward-based care improvement. The total will be automatically 
              calculated as you enter individual specialty counts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}