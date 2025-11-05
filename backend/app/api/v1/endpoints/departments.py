from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.department_service import DepartmentService
from app.schemas.department import (
    DepartmentCreate, 
    DepartmentUpdate,
    DepartmentResponse, 
    DepartmentListResponse,
    CreateDepartmentResponse
)
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/departments", tags=["departments"])


@router.post("/", response_model=CreateDepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(
    department_data: DepartmentCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new department
    
    - **name**: Department name (required, unique)
    - **description**: Department description (optional, auto-generated if not provided)
    - **status**: Department status (default: Active)
    """
    try:
        logger.info(f"Creating new department: {department_data.name}")
        
        # Check if department already exists
        existing_department = DepartmentService.get_department_by_name(db, department_data.name)
        if existing_department:
            logger.warning(f"Department '{department_data.name}' already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Department with name '{department_data.name}' already exists"
            )
        
        # Create the department
        new_department = DepartmentService.create_department(db, department_data)
        
        return CreateDepartmentResponse(
            success=True,
            message=f"Department '{new_department.name}' created successfully",
            department=DepartmentResponse.from_orm(new_department)
        )
        
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected error creating department: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while creating department"
        )


@router.get("/", response_model=DepartmentListResponse)
async def get_all_departments(db: Session = Depends(get_db)):
    """
    Get all departments
    """
    try:
        logger.info("Retrieving all departments")
        departments = DepartmentService.get_all_departments(db)
        
        return DepartmentListResponse(
            departments=[DepartmentResponse.from_orm(dept) for dept in departments],
            total=len(departments)
        )
        
    except Exception as e:
        logger.error(f"Error retrieving departments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while retrieving departments"
        )


@router.get("/active", response_model=List[DepartmentResponse])
async def get_active_departments(db: Session = Depends(get_db)):
    """
    Get only active departments (for dropdowns, etc.)
    """
    try:
        logger.info("Retrieving active departments")
        departments = DepartmentService.get_active_departments(db)
        
        return [DepartmentResponse.from_orm(dept) for dept in departments]
        
    except Exception as e:
        logger.error(f"Error retrieving active departments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while retrieving active departments"
        )


@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department(department_id: int, db: Session = Depends(get_db)):
    """
    Get department by ID
    """
    try:
        logger.info(f"Retrieving department with ID: {department_id}")
        department = DepartmentService.get_department_by_id(db, department_id)
        
        if not department:
            logger.warning(f"Department with ID {department_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Department with ID {department_id} not found"
            )
        
        return DepartmentResponse.from_orm(department)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving department {department_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while retrieving department"
        )


@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: int,
    department_data: DepartmentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update department
    """
    try:
        logger.info(f"Updating department with ID: {department_id}")
        
        updated_department = DepartmentService.update_department(db, department_id, department_data)
        
        if not updated_department:
            logger.warning(f"Department with ID {department_id} not found for update")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Department with ID {department_id} not found"
            )
        
        return DepartmentResponse.from_orm(updated_department)
        
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating department {department_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while updating department"
        )


@router.delete("/{department_id}")
async def delete_department(department_id: int, db: Session = Depends(get_db)):
    """
    Delete department
    """
    try:
        logger.info(f"Deleting department with ID: {department_id}")
        
        success = DepartmentService.delete_department(db, department_id)
        
        if not success:
            logger.warning(f"Department with ID {department_id} not found for deletion")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Department with ID {department_id} not found"
            )
        
        return {"success": True, "message": "Department deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting department {department_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while deleting department"
        )