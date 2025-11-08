import apiClient from './apiClient';

/**
 * Ward 1 Monthly Reports API service
 */
class Ward1ReportsApi {
  /**
   * Create or update a monthly report
   */
  static async saveMonthlyReport(reportData) {
    try {
      const response = await apiClient.post('/ward1/monthly-report', reportData);
      return response.data;
    } catch (error) {
      console.error('Error saving Ward 1 monthly report:', error);
      throw error;
    }
  }

  /**
   * Get monthly report for specific year and month
   */
  static async getMonthlyReport(year, month) {
    try {
      const response = await apiClient.get(`/ward1/monthly-report/${year}/${month}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Return null if report doesn't exist
        return null;
      }
      console.error('Error fetching Ward 1 monthly report:', error);
      throw error;
    }
  }

  /**
   * Get all monthly reports for a specific year
   */
  static async getMonthlyReportsByYear(year) {
    try {
      const response = await apiClient.get(`/ward1/monthly-reports/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Ward 1 monthly reports for year:', error);
      throw error;
    }
  }

  /**
   * Submit monthly report for approval
   */
  static async submitMonthlyReport(year, month, notes = '') {
    try {
      const response = await apiClient.post('/ward1/monthly-report/submit', {
        year,
        month,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting Ward 1 monthly report:', error);
      throw error;
    }
  }

  /**
   * Approve monthly report (Admin/Supervisor only)
   */
  static async approveMonthlyReport(year, month) {
    try {
      const response = await apiClient.put(`/ward1/monthly-report/${year}/${month}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving Ward 1 monthly report:', error);
      throw error;
    }
  }

  /**
   * Delete monthly report (Draft only)
   */
  static async deleteMonthlyReport(year, month) {
    try {
      const response = await apiClient.delete(`/ward1/monthly-report/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting Ward 1 monthly report:', error);
      throw error;
    }
  }

  /**
   * Get Ward 1 statistics for a year
   */
  static async getWard1Statistics(year) {
    try {
      const response = await apiClient.get(`/ward1/statistics/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Ward 1 statistics:', error);
      throw error;
    }
  }

  /**
   * Transform frontend form data to API format
   */
  static transformToApiFormat(formData, year, month) {
    return {
      year,
      month,
      
      // Basic ward info
      total_beds: formData.totalBeds || 0,
      total_beds_hdu: formData.totalBedsHDU || 0,
      total_beds_ward: formData.totalBedsWard || 0,
      total_beds_isolation: formData.totalBedsIsolation || 0,
      
      // Admissions data
      admissions_male: formData.admissionsMale || 0,
      admissions_female: formData.admissionsFemale || 0,
      admissions_ah: formData.admissionsAH || 0,
      admissions_amca: formData.admissionsAMCA || 0,
      admissions_sama: formData.admissionsSAMA || 0,
      
      // Admissions by unit
      admissions_ku: formData.admissionsKU || 0,
      admissions_munt: formData.admissionsMUNT || 0,
      admissions_ward02: formData.admissionsWard02 || 0,
      admissions_isolation: formData.admissionsIsolation || 0,
      admissions_hdu_unit: formData.admissionsHDUUnit || 0,
      
      // Discharge/flow data
      bed_occupancy_rate: formData.bedOccupancyRate || 0,
      avg_length_of_stay: formData.avgLengthOfStay || 0,
      midnight_total: formData.midnightTotal || 0,
      discharges: formData.discharges || 0,
      lama: formData.lama || 0,
      re_admissions: formData.reAdmissions || 0,
      discharge_same_day: formData.dischargeSameDay || 0,
      transfer_to_other_hospitals: formData.transferToOtherHospitals || 0,
      transfer_from_other_hospitals: formData.transferFromOtherHospitals || 0,
      weekday_transfers_in: formData.weekdayTransfersIn || 0,
      weekday_transfers_out: formData.weekdayTransfersOut || 0,
      weekend_transfers_in: formData.weekendTransfersIn || 0,
      weekend_transfers_out: formData.weekendTransfersOut || 0,
      missing: formData.missing || 0,
      
      // Mortality data
      number_of_death: formData.numberOfDeath || 0,
      death_within_24hrs: formData.deathWithin24hrs || 0,
      death_within_48hrs: formData.deathWithin48hrs || 0,
      death_rate: formData.deathRate || 0,
      
      // Diagnostics data
      no_of_hd: formData.noOfHD || 0,
      xray_inward: formData.xrayInward || 0,
      xray_departmental: formData.xrayDepartmental || 0,
      ecg_inward: formData.ecgInward || 0,
      ecg_departmental: formData.ecgDepartmental || 0,
      abg: formData.abg || 0,
      wit_meetings: formData.witMeetings || false,
      
      // Referrals data
      referrals_cardiology: formData.referralsCardiology || 0,
      referrals_chest_physician: formData.referralsChestPhysician || 0,
      referrals_radiodiagnosis: formData.referralsRadiodiagnosis || 0,
      referrals_heumatology: formData.referralsHeumatology || 0,
      referrals_others: formData.referralsOthers || 0,
      total_referrals: formData.totalReferrals || 0
    };
  }

  /**
   * Transform API response to frontend format
   */
  static transformFromApiFormat(apiData) {
    if (!apiData) return null;
    
    return {
      // Basic ward info
      totalBeds: apiData.total_beds || 0,
      totalBedsHDU: apiData.total_beds_hdu || 0,
      totalBedsWard: apiData.total_beds_ward || 0,
      totalBedsIsolation: apiData.total_beds_isolation || 0,
      
      // Admissions data
      admissionsMale: apiData.admissions_male || 0,
      admissionsFemale: apiData.admissions_female || 0,
      admissionsAH: apiData.admissions_ah || 0,
      admissionsAMCA: apiData.admissions_amca || 0,
      admissionsSAMA: apiData.admissions_sama || 0,
      
      // Admissions by unit
      admissionsKU: apiData.admissions_ku || 0,
      admissionsMUNT: apiData.admissions_munt || 0,
      admissionsWard02: apiData.admissions_ward02 || 0,
      admissionsIsolation: apiData.admissions_isolation || 0,
      admissionsHDUUnit: apiData.admissions_hdu_unit || 0,
      
      // Discharge/flow data
      bedOccupancyRate: apiData.bed_occupancy_rate || 0,
      avgLengthOfStay: apiData.avg_length_of_stay || 0,
      midnightTotal: apiData.midnight_total || 0,
      discharges: apiData.discharges || 0,
      lama: apiData.lama || 0,
      reAdmissions: apiData.re_admissions || 0,
      dischargeSameDay: apiData.discharge_same_day || 0,
      transferToOtherHospitals: apiData.transfer_to_other_hospitals || 0,
      transferFromOtherHospitals: apiData.transfer_from_other_hospitals || 0,
      weekdayTransfersIn: apiData.weekday_transfers_in || 0,
      weekdayTransfersOut: apiData.weekday_transfers_out || 0,
      weekendTransfersIn: apiData.weekend_transfers_in || 0,
      weekendTransfersOut: apiData.weekend_transfers_out || 0,
      missing: apiData.missing || 0,
      
      // Mortality data
      numberOfDeath: apiData.number_of_death || 0,
      deathWithin24hrs: apiData.death_within_24hrs || 0,
      deathWithin48hrs: apiData.death_within_48hrs || 0,
      deathRate: apiData.death_rate || 0,
      
      // Diagnostics data
      noOfHD: apiData.no_of_hd || 0,
      xrayInward: apiData.xray_inward || 0,
      xrayDepartmental: apiData.xray_departmental || 0,
      ecgInward: apiData.ecg_inward || 0,
      ecgDepartmental: apiData.ecg_departmental || 0,
      abg: apiData.abg || 0,
      witMeetings: apiData.wit_meetings || false,
      
      // Referrals data
      referralsCardiology: apiData.referrals_cardiology || 0,
      referralsChestPhysician: apiData.referrals_chest_physician || 0,
      referralsRadiodiagnosis: apiData.referrals_radiodiagnosis || 0,
      referralsHeumatology: apiData.referrals_heumatology || 0,
      referralsOthers: apiData.referrals_others || 0,
      totalReferrals: apiData.total_referrals || 0,
      
      // Metadata
      status: apiData.status || 'draft',
      lastSaved: apiData.updated_at || null,
      createdAt: apiData.created_at || null,
      submittedAt: apiData.submitted_at || null,
      approvedAt: apiData.approved_at || null
    };
  }
}

export default Ward1ReportsApi;