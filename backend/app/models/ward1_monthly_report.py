from sqlalchemy import Column, Integer, String, Boolean, DECIMAL, Date, DateTime, Enum, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
import enum


class ReportStatus(enum.Enum):
    draft = "draft"
    submitted = "submitted"
    approved = "approved"


class Ward1MonthlyReport(Base):
    __tablename__ = "ward1_monthly_reports"
    
    # === PRIMARY KEY (Composite) ===
    year = Column(Integer, primary_key=True, nullable=False)
    month = Column(Integer, primary_key=True, nullable=False)
    report_date = Column(Date, nullable=False)
    
    # === ADMISSIONS SECTION ===
    total_beds = Column(Integer, default=30, nullable=False)
    total_beds_hdu = Column(Integer, default=2, nullable=False)
    total_beds_ward = Column(Integer, default=0, nullable=False)
    total_beds_isolation = Column(Integer, default=0, nullable=False)
    admissions_male = Column(Integer, default=0, nullable=False)
    admissions_female = Column(Integer, default=0, nullable=False)
    admissions_ah = Column(Integer, default=0, nullable=False)
    admissions_amca = Column(Integer, default=0, nullable=False)
    admissions_sama = Column(Integer, default=0, nullable=False)
    
    # === ADMISSIONS BY WARD/UNIT ===
    admissions_ku = Column(Integer, default=0, nullable=False)
    admissions_munt = Column(Integer, default=0, nullable=False)
    admissions_ward02 = Column(Integer, default=0, nullable=False)
    admissions_isolation = Column(Integer, default=0, nullable=False)
    admissions_hdu_unit = Column(Integer, default=0, nullable=False)
    
    # === DISCHARGES & FLOW SECTION ===
    bed_occupancy_rate = Column(DECIMAL(5, 2), default=0.00, nullable=False)
    avg_length_of_stay = Column(DECIMAL(5, 2), default=0.00, nullable=False)
    midnight_total = Column(Integer, default=0, nullable=False)
    discharges = Column(Integer, default=0, nullable=False)
    lama = Column(Integer, default=0, nullable=False)
    re_admissions = Column(Integer, default=0, nullable=False)
    discharge_same_day = Column(Integer, default=0, nullable=False)
    transfer_to_other_hospitals = Column(Integer, default=0, nullable=False)
    transfer_from_other_hospitals = Column(Integer, default=0, nullable=False)
    weekday_transfers_in = Column(Integer, default=0, nullable=False)
    weekday_transfers_out = Column(Integer, default=0, nullable=False)
    weekend_transfers_in = Column(Integer, default=0, nullable=False)
    weekend_transfers_out = Column(Integer, default=0, nullable=False)
    missing = Column(Integer, default=0, nullable=False)
    number_of_death = Column(Integer, default=0, nullable=False)
    death_within_24hrs = Column(Integer, default=0, nullable=False)
    death_within_48hrs = Column(Integer, default=0, nullable=False)
    death_rate = Column(DECIMAL(5, 2), default=0.00, nullable=False)
    
    # === DIAGNOSTICS SECTION ===
    no_of_hd = Column(Integer, default=0, nullable=False)
    xray_inward = Column(Integer, default=0, nullable=False)
    xray_departmental = Column(Integer, default=0, nullable=False)
    ecg_inward = Column(Integer, default=0, nullable=False)
    ecg_departmental = Column(Integer, default=0, nullable=False)
    abg = Column(Integer, default=0, nullable=False)
    wit_meetings = Column(Boolean, default=False, nullable=False)
    
    # === REFERRALS SECTION ===
    referrals_cardiology = Column(Integer, default=0, nullable=False)
    referrals_chest_physician = Column(Integer, default=0, nullable=False)
    referrals_radiodiagnosis = Column(Integer, default=0, nullable=False)
    referrals_heumatology = Column(Integer, default=0, nullable=False)
    referrals_others = Column(Integer, default=0, nullable=False)
    total_referrals = Column(Integer, default=0, nullable=False)
    
    # === METADATA ===
    status = Column(Enum(ReportStatus), default=ReportStatus.draft, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    last_updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # === RELATIONSHIPS ===
    creator = relationship("User", foreign_keys=[created_by], back_populates=None)
    updater = relationship("User", foreign_keys=[last_updated_by], back_populates=None)
    
    # === CONSTRAINTS ===
    __table_args__ = (
        CheckConstraint('month >= 1 AND month <= 12', name='check_valid_month'),
        CheckConstraint('year >= 2020', name='check_valid_year'),
        CheckConstraint('bed_occupancy_rate >= 0 AND bed_occupancy_rate <= 100', name='check_occupancy_rate'),
        CheckConstraint('death_rate >= 0 AND death_rate <= 100', name='check_death_rate'),
        CheckConstraint('avg_length_of_stay >= 0', name='check_length_of_stay'),
        CheckConstraint('total_beds > 0', name='check_total_beds'),
        CheckConstraint('total_beds_hdu >= 0', name='check_hdu_beds'),
        CheckConstraint('total_beds_ward >= 0', name='check_ward_beds'),
        CheckConstraint('total_beds_isolation >= 0', name='check_isolation_beds'),
    )
    
    def __repr__(self):
        return f"<Ward1MonthlyReport(year={self.year}, month={self.month}, status={self.status.value})>"
    
    def __str__(self):
        return f"Ward 1 Report - {self.year}/{self.month:02d} ({self.status.value})"
    
    @property
    def total_admissions(self):
        """Calculate total admissions (male + female)"""
        return self.admissions_male + self.admissions_female
    
    @property
    def total_xrays(self):
        """Calculate total X-ray procedures"""
        return self.xray_inward + self.xray_departmental
    
    @property
    def total_ecgs(self):
        """Calculate total ECG procedures"""
        return self.ecg_inward + self.ecg_departmental
    
    @property
    def total_transfers_in(self):
        """Calculate total incoming transfers"""
        return self.transfer_from_other_hospitals + self.weekday_transfers_in + self.weekend_transfers_in
    
    @property
    def total_transfers_out(self):
        """Calculate total outgoing transfers"""
        return self.transfer_to_other_hospitals + self.weekday_transfers_out + self.weekend_transfers_out
    
    @property
    def net_transfer_balance(self):
        """Calculate net transfer balance (in - out)"""
        return self.total_transfers_in - self.total_transfers_out
    
    @property
    def mortality_rate_percentage(self):
        """Calculate mortality rate as percentage of discharges"""
        if self.discharges > 0:
            return round((self.number_of_death / self.discharges) * 100, 2)
        return 0.0
    
    @property
    def occupancy_percentage(self):
        """Get bed occupancy rate as calculated percentage"""
        if self.total_beds > 0 and self.midnight_total > 0:
            return round((self.midnight_total / self.total_beds) * 100, 2)
        return float(self.bed_occupancy_rate)
    
    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            'year': self.year,
            'month': self.month,
            'report_date': self.report_date.isoformat() if self.report_date else None,
            
            # Admissions
            'total_beds': self.total_beds,
            'total_beds_hdu': self.total_beds_hdu,
            'total_beds_ward': self.total_beds_ward,
            'total_beds_isolation': self.total_beds_isolation,
            'admissions_male': self.admissions_male,
            'admissions_female': self.admissions_female,
            'admissions_ah': self.admissions_ah,
            'admissions_amca': self.admissions_amca,
            'admissions_sama': self.admissions_sama,
            'admissions_ku': self.admissions_ku,
            'admissions_munt': self.admissions_munt,
            'admissions_ward02': self.admissions_ward02,
            'admissions_isolation': self.admissions_isolation,
            'admissions_hdu_unit': self.admissions_hdu_unit,
            
            # Discharges & Flow
            'bed_occupancy_rate': float(self.bed_occupancy_rate),
            'avg_length_of_stay': float(self.avg_length_of_stay),
            'midnight_total': self.midnight_total,
            'discharges': self.discharges,
            'lama': self.lama,
            're_admissions': self.re_admissions,
            'discharge_same_day': self.discharge_same_day,
            'transfer_to_other_hospitals': self.transfer_to_other_hospitals,
            'transfer_from_other_hospitals': self.transfer_from_other_hospitals,
            'weekday_transfers_in': self.weekday_transfers_in,
            'weekday_transfers_out': self.weekday_transfers_out,
            'weekend_transfers_in': self.weekend_transfers_in,
            'weekend_transfers_out': self.weekend_transfers_out,
            'missing': self.missing,
            'number_of_death': self.number_of_death,
            'death_within_24hrs': self.death_within_24hrs,
            'death_within_48hrs': self.death_within_48hrs,
            'death_rate': float(self.death_rate),
            
            # Diagnostics
            'no_of_hd': self.no_of_hd,
            'xray_inward': self.xray_inward,
            'xray_departmental': self.xray_departmental,
            'ecg_inward': self.ecg_inward,
            'ecg_departmental': self.ecg_departmental,
            'abg': self.abg,
            'wit_meetings': self.wit_meetings,
            
            # Referrals
            'referrals_cardiology': self.referrals_cardiology,
            'referrals_chest_physician': self.referrals_chest_physician,
            'referrals_radiodiagnosis': self.referrals_radiodiagnosis,
            'referrals_heumatology': self.referrals_heumatology,
            'referrals_others': self.referrals_others,
            'total_referrals': self.total_referrals,
            
            # Metadata
            'status': self.status.value,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_by': self.created_by,
            'last_updated_by': self.last_updated_by,
            
            # Calculated properties
            'total_admissions': self.total_admissions,
            'total_xrays': self.total_xrays,
            'total_ecgs': self.total_ecgs,
            'total_transfers_in': self.total_transfers_in,
            'total_transfers_out': self.total_transfers_out,
            'net_transfer_balance': self.net_transfer_balance,
            'mortality_rate_percentage': self.mortality_rate_percentage,
            'occupancy_percentage': self.occupancy_percentage
        }