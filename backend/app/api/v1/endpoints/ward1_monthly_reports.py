from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.services.ward1_monthly_report_service import Ward1MonthlyReportService
from app.schemas.ward1_monthly_report import (
    Ward1MonthlyReportCreate,
    Ward1MonthlyReportUpdate,
    Ward1MonthlyReportResponse,
    Ward1MonthlyReportSubmit,
    MessageResponse
)
from app.utils.auth_dependencies import get_current_user
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ward1", tags=["Ward 1 Monthly Reports"])


@router.post("/monthly-report", response_model=MessageResponse)
async def create_or_update_monthly_report(
    report_data: Ward1MonthlyReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create new monthly report or update existing one for Ward 1
    """
    try:
        # Save or update the report
        saved_report = Ward1MonthlyReportService.create_or_update_report(
            db=db, 
            report_data=report_data, 
            user_id=current_user.id
        )
        
        # Determine if it was created or updated
        action = "updated" if saved_report.created_at != saved_report.updated_at else "created"
        
        return MessageResponse(
            success=True,
            message=f"Ward 1 monthly report for {report_data.month:02d}/{report_data.year} {action} successfully!",
            data={
                "year": saved_report.year,
                "month": saved_report.month,
                "status": saved_report.status.value,
                "action": action,
                "total_admissions": saved_report.total_admissions,
                "total_discharges": saved_report.discharges
            }
        )
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error saving Ward1 monthly report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save monthly report. Please try again."
        )


@router.get("/monthly-report/{year}/{month}", response_model=Ward1MonthlyReportResponse)
async def get_monthly_report(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get monthly report for specific year and month
    """
    try:
        # Validate year and month
        if not 1 <= month <= 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Month must be between 1 and 12"
            )
        
        if not 2020 <= year <= 2030:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Year must be between 2020 and 2030"
            )
        
        # Get the report
        report = Ward1MonthlyReportService.get_report_by_year_month(db, year, month)
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No monthly report found for Ward 1 in {month:02d}/{year}"
            )
        
        return Ward1MonthlyReportResponse.from_orm(report)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving Ward1 monthly report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve monthly report"
        )


@router.get("/monthly-reports/{year}", response_model=List[Ward1MonthlyReportResponse])
async def get_monthly_reports_by_year(
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all monthly reports for a specific year
    """
    try:
        if not 2020 <= year <= 2030:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Year must be between 2020 and 2030"
            )
        
        reports = Ward1MonthlyReportService.get_reports_by_year(db, year)
        
        return [Ward1MonthlyReportResponse.from_orm(report) for report in reports]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving Ward1 monthly reports for {year}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve monthly reports for {year}"
        )


@router.post("/monthly-report/submit", response_model=MessageResponse)
async def submit_monthly_report(
    submit_data: Ward1MonthlyReportSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit monthly report for approval
    """
    try:
        # Submit the report
        submitted_report = Ward1MonthlyReportService.submit_report_for_approval(
            db=db,
            submit_data=submit_data,
            user_id=current_user.id
        )
        
        return MessageResponse(
            success=True,
            message=f"Ward 1 monthly report for {submit_data.month:02d}/{submit_data.year} submitted for approval successfully!",
            data={
                "year": submitted_report.year,
                "month": submitted_report.month,
                "status": submitted_report.status.value,
                "submitted_by": current_user.name,
                "submitted_at": submitted_report.updated_at.isoformat()
            }
        )
        
    except ValueError as e:
        logger.warning(f"Validation error submitting report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error submitting Ward1 monthly report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit monthly report for approval"
        )


@router.put("/monthly-report/{year}/{month}/approve", response_model=MessageResponse)
async def approve_monthly_report(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Approve a submitted monthly report (Admin/Supervisor only)
    """
    try:
        # Check if user has approval permissions (add role check if needed)
        if current_user.role not in ["admin", "supervisor"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators and supervisors can approve reports"
            )
        
        # Approve the report
        approved_report = Ward1MonthlyReportService.approve_report(
            db=db,
            year=year,
            month=month,
            approver_user_id=current_user.id
        )
        
        return MessageResponse(
            success=True,
            message=f"Ward 1 monthly report for {month:02d}/{year} approved successfully!",
            data={
                "year": approved_report.year,
                "month": approved_report.month,
                "status": approved_report.status.value,
                "approved_by": current_user.name,
                "approved_at": approved_report.updated_at.isoformat()
            }
        )
        
    except ValueError as e:
        logger.warning(f"Validation error approving report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error approving Ward1 monthly report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve monthly report"
        )


@router.delete("/monthly-report/{year}/{month}", response_model=MessageResponse)
async def delete_monthly_report(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a draft monthly report
    """
    try:
        # Delete the report (only if status is 'draft')
        success = Ward1MonthlyReportService.delete_report(db, year, month)
        
        if success:
            return MessageResponse(
                success=True,
                message=f"Ward 1 monthly report for {month:02d}/{year} deleted successfully!",
                data={
                    "year": year,
                    "month": month,
                    "deleted_by": current_user.name
                }
            )
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete report"
        )
        
    except ValueError as e:
        logger.warning(f"Validation error deleting report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error deleting Ward1 monthly report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete monthly report"
        )


@router.get("/statistics/{year}")
async def get_ward1_statistics(
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get statistics for Ward 1 reports in a given year
    """
    try:
        if not 2020 <= year <= 2030:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Year must be between 2020 and 2030"
            )
        
        statistics = Ward1MonthlyReportService.get_report_statistics(db, year)
        
        return {
            "success": True,
            "message": f"Ward 1 statistics for {year} retrieved successfully",
            "data": statistics
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving Ward1 statistics for {year}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve statistics for {year}"
        )