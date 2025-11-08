from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date, datetime
from enum import Enum


class ReportStatus(str, Enum):
    draft = "draft"
    submitted = "submitted"
    approved = "approved"


class Ward1MonthlyReportCreate(BaseModel):
    """Schema for creating a new Ward1 monthly report"""
    
    # === TIME PERIOD ===
    year: int = Field(..., ge=2020, le=2030, description="Report year")
    month: int = Field(..., ge=1, le=12, description="Report month (1-12)")
    
    # === ADMISSIONS SECTION ===
    total_beds: int = Field(default=30, ge=1, description="Total ward beds")
    total_beds_hdu: int = Field(default=2, ge=0, description="Total HDU beds")
    total_beds_ward: int = Field(default=0, ge=0, description="Ward 02 bed capacity")
    total_beds_isolation: int = Field(default=0, ge=0, description="Isolation ward bed capacity")
    admissions_male: int = Field(default=0, ge=0, description="Male admissions")
    admissions_female: int = Field(default=0, ge=0, description="Female admissions")
    admissions_ah: int = Field(default=0, ge=0, description="AH category admissions")
    admissions_amca: int = Field(default=0, ge=0, description="AMCA category admissions")
    admissions_sama: int = Field(default=0, ge=0, description="SAMA category admissions")
    
    # === ADMISSIONS BY WARD/UNIT ===
    admissions_ku: int = Field(default=0, ge=0, description="KU ward admissions")
    admissions_munt: int = Field(default=0, ge=0, description="MUNT ward admissions")
    admissions_ward02: int = Field(default=0, ge=0, description="Ward 02 admissions")
    admissions_isolation: int = Field(default=0, ge=0, description="Isolation ward admissions")
    admissions_hdu_unit: int = Field(default=0, ge=0, description="HDU unit admissions")
    
    # === DISCHARGES & FLOW SECTION ===
    bed_occupancy_rate: float = Field(default=0.0, ge=0, le=100, description="Bed occupancy rate (%)")
    avg_length_of_stay: float = Field(default=0.0, ge=0, description="Average length of stay (days)")
    midnight_total: int = Field(default=0, ge=0, description="Midnight census")
    discharges: int = Field(default=0, ge=0, description="Total discharges")
    lama: int = Field(default=0, ge=0, description="Leave Against Medical Advice")
    re_admissions: int = Field(default=0, ge=0, description="Re-admissions")
    discharge_same_day: int = Field(default=0, ge=0, description="Same day discharges")
    transfer_to_other_hospitals: int = Field(default=0, ge=0, description="Transfers out")
    transfer_from_other_hospitals: int = Field(default=0, ge=0, description="Transfers in")
    weekday_transfers_in: int = Field(default=0, ge=0, description="Weekday transfers in")
    weekday_transfers_out: int = Field(default=0, ge=0, description="Weekday transfers out")
    weekend_transfers_in: int = Field(default=0, ge=0, description="Weekend transfers in")
    weekend_transfers_out: int = Field(default=0, ge=0, description="Weekend transfers out")
    missing: int = Field(default=0, ge=0, description="Missing patients")
    number_of_death: int = Field(default=0, ge=0, description="Number of deaths")
    death_within_24hrs: int = Field(default=0, ge=0, description="Deaths within 24 hours")
    death_within_48hrs: int = Field(default=0, ge=0, description="Deaths within 48 hours")
    death_rate: float = Field(default=0.0, ge=0, le=100, description="Death rate (%)")
    
    # === DIAGNOSTICS SECTION ===
    no_of_hd: int = Field(default=0, ge=0, description="Number of hemodialysis procedures")
    xray_inward: int = Field(default=0, ge=0, description="X-ray procedures (inward)")
    xray_departmental: int = Field(default=0, ge=0, description="X-ray procedures (departmental)")
    ecg_inward: int = Field(default=0, ge=0, description="ECG procedures (inward)")
    ecg_departmental: int = Field(default=0, ge=0, description="ECG procedures (departmental)")
    abg: int = Field(default=0, ge=0, description="Arterial blood gas tests")
    wit_meetings: bool = Field(default=False, description="Ward improvement team meetings held")
    
    # === REFERRALS SECTION ===
    referrals_cardiology: int = Field(default=0, ge=0, description="Cardiology referrals")
    referrals_chest_physician: int = Field(default=0, ge=0, description="Chest physician referrals")
    referrals_radiodiagnosis: int = Field(default=0, ge=0, description="Radiodiagnosis referrals")
    referrals_heumatology: int = Field(default=0, ge=0, description="Hematology referrals")
    referrals_others: int = Field(default=0, ge=0, description="Other referrals")
    total_referrals: int = Field(default=0, ge=0, description="Total referrals")
    
    # === METADATA ===
    status: ReportStatus = Field(default=ReportStatus.draft, description="Report status")
    created_by: Optional[int] = Field(default=None, description="Creator user ID")

    @validator('month')
    def validate_month(cls, v):
        if not 1 <= v <= 12:
            raise ValueError('Month must be between 1 and 12')
        return v

    @validator('year')
    def validate_year(cls, v):
        if v < 2020 or v > 2030:
            raise ValueError('Year must be between 2020 and 2030')
        return v

    class Config:
        schema_extra = {
            "example": {
                "year": 2025,
                "month": 1,
                "total_beds": 30,
                "total_beds_hdu": 2,
                "admissions_male": 45,
                "admissions_female": 38,
                "bed_occupancy_rate": 75.5,
                "discharges": 42,
                "status": "draft"
            }
        }


class Ward1MonthlyReportUpdate(BaseModel):
    """Schema for updating an existing Ward1 monthly report"""
    
    # All fields optional for updates
    total_beds: Optional[int] = Field(None, ge=1)
    total_beds_hdu: Optional[int] = Field(None, ge=0)
    admissions_male: Optional[int] = Field(None, ge=0)
    admissions_female: Optional[int] = Field(None, ge=0)
    admissions_ah: Optional[int] = Field(None, ge=0)
    admissions_amca: Optional[int] = Field(None, ge=0)
    admissions_sama: Optional[int] = Field(None, ge=0)
    admissions_ku: Optional[int] = Field(None, ge=0)
    admissions_munt: Optional[int] = Field(None, ge=0)
    admissions_ward02: Optional[int] = Field(None, ge=0)
    admissions_isolation: Optional[int] = Field(None, ge=0)
    admissions_hdu_unit: Optional[int] = Field(None, ge=0)
    bed_occupancy_rate: Optional[float] = Field(None, ge=0, le=100)
    avg_length_of_stay: Optional[float] = Field(None, ge=0)
    midnight_total: Optional[int] = Field(None, ge=0)
    discharges: Optional[int] = Field(None, ge=0)
    lama: Optional[int] = Field(None, ge=0)
    re_admissions: Optional[int] = Field(None, ge=0)
    discharge_same_day: Optional[int] = Field(None, ge=0)
    transfer_to_other_hospitals: Optional[int] = Field(None, ge=0)
    transfer_from_other_hospitals: Optional[int] = Field(None, ge=0)
    weekday_transfers_in: Optional[int] = Field(None, ge=0)
    weekday_transfers_out: Optional[int] = Field(None, ge=0)
    weekend_transfers_in: Optional[int] = Field(None, ge=0)
    weekend_transfers_out: Optional[int] = Field(None, ge=0)
    missing: Optional[int] = Field(None, ge=0)
    number_of_death: Optional[int] = Field(None, ge=0)
    death_within_24hrs: Optional[int] = Field(None, ge=0)
    death_within_48hrs: Optional[int] = Field(None, ge=0)
    death_rate: Optional[float] = Field(None, ge=0, le=100)
    no_of_hd: Optional[int] = Field(None, ge=0)
    xray_inward: Optional[int] = Field(None, ge=0)
    xray_departmental: Optional[int] = Field(None, ge=0)
    ecg_inward: Optional[int] = Field(None, ge=0)
    ecg_departmental: Optional[int] = Field(None, ge=0)
    abg: Optional[int] = Field(None, ge=0)
    wit_meetings: Optional[bool] = None
    referrals_cardiology: Optional[int] = Field(None, ge=0)
    referrals_chest_physician: Optional[int] = Field(None, ge=0)
    referrals_radiodiagnosis: Optional[int] = Field(None, ge=0)
    referrals_heumatology: Optional[int] = Field(None, ge=0)
    referrals_others: Optional[int] = Field(None, ge=0)
    total_referrals: Optional[int] = Field(None, ge=0)
    status: Optional[ReportStatus] = None
    last_updated_by: Optional[int] = None


class Ward1MonthlyReportResponse(BaseModel):
    """Schema for API responses"""
    
    # === TIME PERIOD ===
    year: int
    month: int
    report_date: Optional[date]
    
    # === ALL DATA FIELDS ===
    total_beds: int
    total_beds_hdu: int
    total_beds_ward: int
    total_beds_isolation: int
    admissions_male: int
    admissions_female: int
    admissions_ah: int
    admissions_amca: int
    admissions_sama: int
    admissions_ku: int
    admissions_munt: int
    admissions_ward02: int
    admissions_isolation: int
    admissions_hdu_unit: int
    bed_occupancy_rate: float
    avg_length_of_stay: float
    midnight_total: int
    discharges: int
    lama: int
    re_admissions: int
    discharge_same_day: int
    transfer_to_other_hospitals: int
    transfer_from_other_hospitals: int
    weekday_transfers_in: int
    weekday_transfers_out: int
    weekend_transfers_in: int
    weekend_transfers_out: int
    missing: int
    number_of_death: int
    death_within_24hrs: int
    death_within_48hrs: int
    death_rate: float
    no_of_hd: int
    xray_inward: int
    xray_departmental: int
    ecg_inward: int
    ecg_departmental: int
    abg: int
    wit_meetings: bool
    referrals_cardiology: int
    referrals_chest_physician: int
    referrals_radiodiagnosis: int
    referrals_heumatology: int
    referrals_others: int
    total_referrals: int
    
    # === METADATA ===
    status: ReportStatus
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_by: Optional[int]
    last_updated_by: Optional[int]
    
    # === CALCULATED FIELDS ===
    total_admissions: int
    total_xrays: int
    total_ecgs: int
    total_transfers_in: int
    total_transfers_out: int
    net_transfer_balance: int
    mortality_rate_percentage: float
    occupancy_percentage: float

    class Config:
        from_attributes = True
        schema_extra = {
            "example": {
                "year": 2025,
                "month": 1,
                "total_beds": 30,
                "admissions_male": 45,
                "admissions_female": 38,
                "total_admissions": 83,
                "status": "submitted",
                "created_at": "2025-01-15T14:30:25"
            }
        }


class Ward1MonthlyReportSubmit(BaseModel):
    """Schema for submitting a report for approval"""
    year: int = Field(..., ge=2020, le=2030)
    month: int = Field(..., ge=1, le=12)
    submitted_by: Optional[int] = None

    class Config:
        schema_extra = {
            "example": {
                "year": 2025,
                "month": 1,
                "submitted_by": 15
            }
        }


class MessageResponse(BaseModel):
    """Schema for API success/error messages"""
    success: bool
    message: str
    data: Optional[dict] = None

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "message": "Ward 1 monthly report for January 2025 saved successfully!",
                "data": {"year": 2025, "month": 1, "status": "draft"}
            }
        }