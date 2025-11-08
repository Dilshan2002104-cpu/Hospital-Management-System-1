from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.ward1_monthly_report import Ward1MonthlyReport, ReportStatus
from app.schemas.ward1_monthly_report import (
    Ward1MonthlyReportCreate, 
    Ward1MonthlyReportUpdate,
    Ward1MonthlyReportSubmit
)
from datetime import date, datetime
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)


class Ward1MonthlyReportService:
    """Service class for Ward1 monthly report operations"""
    
    @staticmethod
    def create_or_update_report(
        db: Session, 
        report_data: Ward1MonthlyReportCreate, 
        user_id: Optional[int] = None
    ) -> Ward1MonthlyReport:
        """
        Create new report or update existing one for given year/month
        """
        try:
            # Check if report already exists for this year/month
            existing_report = Ward1MonthlyReportService.get_report_by_year_month(
                db, report_data.year, report_data.month
            )
            
            if existing_report:
                # Update existing report
                logger.info(f"Updating existing Ward1 report for {report_data.year}/{report_data.month}")
                
                # Update all fields from the request
                for field, value in report_data.dict().items():
                    if field not in ['year', 'month', 'created_by']:  # Skip primary key and created_by
                        setattr(existing_report, field, value)
                
                # Set metadata
                existing_report.last_updated_by = user_id
                existing_report.updated_at = datetime.utcnow()
                
                db.commit()
                db.refresh(existing_report)
                
                logger.info(f"Successfully updated Ward1 report {report_data.year}/{report_data.month}")
                return existing_report
                
            else:
                # Create new report
                logger.info(f"Creating new Ward1 report for {report_data.year}/{report_data.month}")
                
                # Prepare data for new report
                report_dict = report_data.dict()
                report_dict['report_date'] = date(report_data.year, report_data.month, 1)
                report_dict['created_by'] = user_id
                report_dict['last_updated_by'] = user_id
                
                # Create new report instance
                new_report = Ward1MonthlyReport(**report_dict)
                
                db.add(new_report)
                db.commit()
                db.refresh(new_report)
                
                logger.info(f"Successfully created Ward1 report {report_data.year}/{report_data.month}")
                return new_report
                
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Database integrity error: {str(e)}")
            raise ValueError(f"Invalid data provided: {str(e)}")
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating/updating Ward1 report: {str(e)}")
            raise Exception(f"Failed to save report: {str(e)}")

    @staticmethod
    def get_report_by_year_month(
        db: Session, 
        year: int, 
        month: int
    ) -> Optional[Ward1MonthlyReport]:
        """
        Get report by year and month
        """
        try:
            report = db.query(Ward1MonthlyReport).filter(
                Ward1MonthlyReport.year == year,
                Ward1MonthlyReport.month == month
            ).first()
            
            logger.info(f"Retrieved Ward1 report for {year}/{month}: {'Found' if report else 'Not found'}")
            return report
            
        except Exception as e:
            logger.error(f"Error retrieving Ward1 report for {year}/{month}: {str(e)}")
            raise Exception(f"Failed to retrieve report: {str(e)}")

    @staticmethod
    def get_reports_by_year(
        db: Session, 
        year: int
    ) -> List[Ward1MonthlyReport]:
        """
        Get all reports for a specific year
        """
        try:
            reports = db.query(Ward1MonthlyReport).filter(
                Ward1MonthlyReport.year == year
            ).order_by(Ward1MonthlyReport.month).all()
            
            logger.info(f"Retrieved {len(reports)} Ward1 reports for year {year}")
            return reports
            
        except Exception as e:
            logger.error(f"Error retrieving Ward1 reports for year {year}: {str(e)}")
            raise Exception(f"Failed to retrieve reports for year {year}: {str(e)}")

    @staticmethod
    def get_all_reports(
        db: Session, 
        limit: int = 100, 
        offset: int = 0
    ) -> List[Ward1MonthlyReport]:
        """
        Get all reports with pagination
        """
        try:
            reports = db.query(Ward1MonthlyReport).order_by(
                Ward1MonthlyReport.year.desc(),
                Ward1MonthlyReport.month.desc()
            ).offset(offset).limit(limit).all()
            
            logger.info(f"Retrieved {len(reports)} Ward1 reports (limit: {limit}, offset: {offset})")
            return reports
            
        except Exception as e:
            logger.error(f"Error retrieving Ward1 reports: {str(e)}")
            raise Exception(f"Failed to retrieve reports: {str(e)}")

    @staticmethod
    def submit_report_for_approval(
        db: Session, 
        submit_data: Ward1MonthlyReportSubmit,
        user_id: Optional[int] = None
    ) -> Ward1MonthlyReport:
        """
        Submit report for approval (change status to 'submitted')
        """
        try:
            report = Ward1MonthlyReportService.get_report_by_year_month(
                db, submit_data.year, submit_data.month
            )
            
            if not report:
                raise ValueError(f"No report found for {submit_data.year}/{submit_data.month}")
            
            if report.status == ReportStatus.approved:
                raise ValueError("Cannot submit an already approved report")
            
            # Update status to submitted
            report.status = ReportStatus.submitted
            report.last_updated_by = user_id or submit_data.submitted_by
            report.updated_at = datetime.utcnow()
            
            db.commit()
            db.refresh(report)
            
            logger.info(f"Successfully submitted Ward1 report {submit_data.year}/{submit_data.month} for approval")
            return report
            
        except ValueError as e:
            logger.warning(f"Validation error submitting report: {str(e)}")
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Error submitting Ward1 report: {str(e)}")
            raise Exception(f"Failed to submit report: {str(e)}")

    @staticmethod
    def approve_report(
        db: Session, 
        year: int, 
        month: int,
        approver_user_id: Optional[int] = None
    ) -> Ward1MonthlyReport:
        """
        Approve a submitted report (change status to 'approved')
        """
        try:
            report = Ward1MonthlyReportService.get_report_by_year_month(db, year, month)
            
            if not report:
                raise ValueError(f"No report found for {year}/{month}")
            
            if report.status != ReportStatus.submitted:
                raise ValueError("Can only approve submitted reports")
            
            # Update status to approved
            report.status = ReportStatus.approved
            report.last_updated_by = approver_user_id
            report.updated_at = datetime.utcnow()
            
            db.commit()
            db.refresh(report)
            
            logger.info(f"Successfully approved Ward1 report {year}/{month}")
            return report
            
        except ValueError as e:
            logger.warning(f"Validation error approving report: {str(e)}")
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Error approving Ward1 report: {str(e)}")
            raise Exception(f"Failed to approve report: {str(e)}")

    @staticmethod
    def delete_report(
        db: Session, 
        year: int, 
        month: int
    ) -> bool:
        """
        Delete a report (only if status is 'draft')
        """
        try:
            report = Ward1MonthlyReportService.get_report_by_year_month(db, year, month)
            
            if not report:
                raise ValueError(f"No report found for {year}/{month}")
            
            if report.status != ReportStatus.draft:
                raise ValueError("Can only delete draft reports")
            
            db.delete(report)
            db.commit()
            
            logger.info(f"Successfully deleted Ward1 report {year}/{month}")
            return True
            
        except ValueError as e:
            logger.warning(f"Validation error deleting report: {str(e)}")
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting Ward1 report: {str(e)}")
            raise Exception(f"Failed to delete report: {str(e)}")

    @staticmethod
    def get_report_statistics(db: Session, year: int) -> dict:
        """
        Get statistics for reports in a given year
        """
        try:
            reports = Ward1MonthlyReportService.get_reports_by_year(db, year)
            
            if not reports:
                return {
                    "year": year,
                    "total_reports": 0,
                    "draft_reports": 0,
                    "submitted_reports": 0,
                    "approved_reports": 0,
                    "completion_rate": 0.0
                }
            
            draft_count = len([r for r in reports if r.status == ReportStatus.draft])
            submitted_count = len([r for r in reports if r.status == ReportStatus.submitted])
            approved_count = len([r for r in reports if r.status == ReportStatus.approved])
            
            return {
                "year": year,
                "total_reports": len(reports),
                "draft_reports": draft_count,
                "submitted_reports": submitted_count,
                "approved_reports": approved_count,
                "completion_rate": round((len(reports) / 12) * 100, 2),  # 12 months in year
                "avg_total_admissions": round(sum(r.total_admissions for r in reports) / len(reports), 2),
                "avg_total_discharges": round(sum(r.discharges for r in reports) / len(reports), 2),
                "avg_occupancy_rate": round(sum(r.occupancy_percentage for r in reports) / len(reports), 2)
            }
            
        except Exception as e:
            logger.error(f"Error calculating Ward1 report statistics for {year}: {str(e)}")
            raise Exception(f"Failed to calculate statistics: {str(e)}")