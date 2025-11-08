import React from 'react';

export default function DischargesFlowTab({ data, updateData, disabled }) {
  const handleInputChange = (field, value) => {
    updateData(field, value);
  };

  // Calculate bed occupancy rate if beds and midnight total are available
  const totalBeds = (data.totalBedsWard || 0) + (data.totalBedsIsolation || 0) + (data.totalBedsHDU || 0);
  const calculatedOccupancyRate = totalBeds > 0 && data.midnightTotal > 0 
    ? (data.midnightTotal / totalBeds * 100).toFixed(2) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Occupancy and Flow Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📊 Occupancy & Flow Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bed occupancy rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.bedOccupancyRate || ''}
              onChange={(e) => handleInputChange('bedOccupancyRate', parseFloat(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder={calculatedOccupancyRate}
            />
            <p className="text-xs text-gray-500 mt-1">
              Suggested: {calculatedOccupancyRate}% (based on midnight total)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avg. length of stay (days)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={data.avgLengthOfStay || ''}
              onChange={(e) => handleInputChange('avgLengthOfStay', parseFloat(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="2.99"
            />
            <p className="text-xs text-gray-500 mt-1">Average days per patient</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Midnight total
            </label>
            <input
              type="number"
              min="0"
              value={data.midnightTotal || ''}
              onChange={(e) => handleInputChange('midnightTotal', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="424"
            />
            <p className="text-xs text-gray-500 mt-1">Total patients at midnight</p>
          </div>
        </div>
      </div>

      {/* Discharge Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🚪 Patient Discharges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dischargers
            </label>
            <input
              type="number"
              min="0"
              value={data.discharges || ''}
              onChange={(e) => handleInputChange('discharges', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="153"
            />
            <p className="text-xs text-gray-500 mt-1">Total patients discharged</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LAMA (Left Against Medical Advice)
            </label>
            <input
              type="number"
              min="0"
              value={data.lama || ''}
              onChange={(e) => handleInputChange('lama', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Patients who left AMA</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Re-admissions
            </label>
            <input
              type="number"
              min="0"
              value={data.reAdmissions || ''}
              onChange={(e) => handleInputChange('reAdmissions', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Patients readmitted</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discharge same day of admission
            </label>
            <input
              type="number"
              min="0"
              value={data.dischargeSameDay || ''}
              onChange={(e) => handleInputChange('dischargeSameDay', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Same-day discharges</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer to other hospitals
            </label>
            <input
              type="number"
              min="0"
              value={data.transferToOtherHospitals || ''}
              onChange={(e) => handleInputChange('transferToOtherHospitals', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Patients transferred out</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer from other hospitals
            </label>
            <input
              type="number"
              min="0"
              value={data.transferFromOtherHospitals || ''}
              onChange={(e) => handleInputChange('transferFromOtherHospitals', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Patients transferred in</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Weekday transfers
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* IN */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  IN
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.weekdayTransfersIn || ''}
                  onChange={(e) => handleInputChange('weekdayTransfersIn', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg text-center font-semibold disabled:bg-gray-50"
                  placeholder="0"
                />
              </div>
              
              {/* OUT */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  OUT
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.weekdayTransfersOut || ''}
                  onChange={(e) => handleInputChange('weekdayTransfersOut', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg text-center font-semibold disabled:bg-gray-50"
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Patient transfers during weekdays</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Weekend transfers
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* IN */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  IN
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.weekendTransfersIn || ''}
                  onChange={(e) => handleInputChange('weekendTransfersIn', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg text-center font-semibold disabled:bg-gray-50"
                  placeholder="0"
                />
              </div>
              
              {/* OUT */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  OUT
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.weekendTransfersOut || ''}
                  onChange={(e) => handleInputChange('weekendTransfersOut', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-center font-semibold disabled:bg-gray-50"
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Patient transfers during weekends</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MISSING
            </label>
            <input
              type="number"
              min="0"
              value={data.missing || ''}
              onChange={(e) => handleInputChange('missing', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Missing patients</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of death
            </label>
            <input
              type="number"
              min="0"
              value={data.numberOfDeath || ''}
              onChange={(e) => handleInputChange('numberOfDeath', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Patient deaths</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Death within
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* 24hrs */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  24hrs
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.deathWithin24hrs || ''}
                  onChange={(e) => handleInputChange('deathWithin24hrs', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 text-lg text-center font-semibold disabled:bg-gray-50"
                  placeholder="0"
                />
              </div>
              
              {/* 48hrs */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  48hrs
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.deathWithin48hrs || ''}
                  onChange={(e) => handleInputChange('deathWithin48hrs', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 text-lg text-center font-semibold disabled:bg-gray-50"
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Deaths within specified timeframes</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Death rate
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={data.deathRate || ''}
              onChange={(e) => handleInputChange('deathRate', parseFloat(e.target.value) || 0)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800 text-lg text-center font-semibold disabled:bg-gray-50"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">Death rate percentage (%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}