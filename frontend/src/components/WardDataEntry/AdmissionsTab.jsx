import React from 'react';

export default function AdmissionsTab({ data, updateData, disabled }) {
  const handleInputChange = (field, value) => {
    updateData(field, value);
  };

  // Calculate total admissions automatically
  const totalAdmissions = (data.admissionsMale || 0) + (data.admissionsFemale || 0);

  return (
    <div className="space-y-8">
      {/* Bed Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🛏️ Bed Capacity Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total no. of beds (Ward 02)
            </label>
            <input
              type="number"
              min="0"
              value={data.totalBedsWard || ''}
              onChange={(e) => handleInputChange('totalBedsWard', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="24"
            />
            <p className="text-xs text-gray-500 mt-1">Standard ward beds</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total no. of beds (Isolation)
            </label>
            <input
              type="number"
              min="0"
              value={data.totalBedsIsolation || ''}
              onChange={(e) => handleInputChange('totalBedsIsolation', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="04"
            />
            <p className="text-xs text-gray-500 mt-1">Isolation unit beds</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total no. of beds (HDU)
            </label>
            <input
              type="number"
              min="0"
              value={data.totalBedsHDU || ''}
              onChange={(e) => handleInputChange('totalBedsHDU', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="02"
            />
            <p className="text-xs text-gray-500 mt-1">High Dependency Unit beds</p>
          </div>
        </div>
      </div>

      {/* Patient Admissions by Gender */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          👥 Patient Admissions by Gender
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No. of admissions (Male)
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsMale || ''}
              onChange={(e) => handleInputChange('admissionsMale', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Male patients admitted</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No. of admissions (Female)
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsFemale || ''}
              onChange={(e) => handleInputChange('admissionsFemale', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Female patients admitted</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TOTAL ADMISSIONS (M+F)
            </label>
            <input
              type="number"
              value={totalAdmissions}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-blue-50 text-lg text-center font-bold text-blue-900"
            />
            <p className="text-xs text-blue-600 mt-1">Auto-calculated total</p>
          </div>
        </div>
      </div>

      {/* Age Category Admissions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📊 Admissions by Age Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AH (Adult/General)
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsAH || ''}
              onChange={(e) => handleInputChange('admissionsAH', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">General adult admissions</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AM/CA (Adult Male/Child Adult)
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsAMCA || ''}
              onChange={(e) => handleInputChange('admissionsAMCA', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Adult male/child adult</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SA/MA (Senior Adult/Middle Age)
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsSAMA || ''}
              onChange={(e) => handleInputChange('admissionsSAMA', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Senior/middle age admissions</p>
          </div>
        </div>
      </div>

      {/* Admissions by Ward/Unit Location */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🏥 Admissions by Ward/Unit Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KU (Kidney Unit)
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsKU || ''}
              onChange={(e) => handleInputChange('admissionsKU', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Kidney Unit admissions</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MUNT (Medical Unit)
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsMUNT || ''}
              onChange={(e) => handleInputChange('admissionsMUNT', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Medical Unit admissions</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ward 02
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsWard02 || ''}
              onChange={(e) => handleInputChange('admissionsWard02', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Ward 02 admissions</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isolation Unit
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsIsolation || ''}
              onChange={(e) => handleInputChange('admissionsIsolation', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Isolation Unit admissions</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HDU (High Dependency Unit)
            </label>
            <input
              type="number"
              min="0"
              value={data.admissionsHDUUnit || ''}
              onChange={(e) => handleInputChange('admissionsHDUUnit', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">HDU admissions</p>
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
            <h4 className="text-sm font-medium text-blue-800">Admission Data Guidelines</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Enter the actual number of beds available in each category</li>
              <li>• Record all patient admissions for the entire month</li>
              <li>• Total admissions will be automatically calculated</li>
              <li>• Age categories help track demographic patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}