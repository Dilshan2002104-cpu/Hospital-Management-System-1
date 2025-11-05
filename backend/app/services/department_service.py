from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.department import Department
from app.schemas.department import DepartmentCreate, DepartmentUpdate
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class DepartmentService:
    """Service layer for department operations"""
    
    @staticmethod
    def create_department(db: Session, department_data: DepartmentCreate) -> Department:
        """
        Create a new department
        """
        try:
            db_department = Department(
                name=department_data.name,
                status=department_data.status
            )
            
            db.add(db_department)
            db.commit()
            db.refresh(db_department)
            
            logger.info(f"Department '{db_department.name}' created successfully with ID: {db_department.id}")
            return db_department
            
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Failed to create department '{department_data.name}': {str(e)}")
            raise ValueError(f"Department with name '{department_data.name}' already exists")
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error creating department: {str(e)}")
            raise e
    
    @staticmethod
    def get_all_departments(db: Session) -> List[Department]:
        """
        Get all departments
        """
        try:
            departments = db.query(Department).order_by(Department.name).all()
            logger.info(f"Retrieved {len(departments)} departments")
            return departments
        except Exception as e:
            logger.error(f"Error retrieving departments: {str(e)}")
            raise e
    
    @staticmethod
    def get_department_by_id(db: Session, department_id: int) -> Optional[Department]:
        """
        Get department by ID
        """
        try:
            department = db.query(Department).filter(Department.id == department_id).first()
            if department:
                logger.info(f"Retrieved department: {department.name}")
            else:
                logger.warning(f"Department with ID {department_id} not found")
            return department
        except Exception as e:
            logger.error(f"Error retrieving department by ID {department_id}: {str(e)}")
            raise e
    
    @staticmethod
    def get_department_by_name(db: Session, name: str) -> Optional[Department]:
        """
        Get department by name
        """
        try:
            department = db.query(Department).filter(Department.name.ilike(f"%{name}%")).first()
            return department
        except Exception as e:
            logger.error(f"Error retrieving department by name '{name}': {str(e)}")
            raise e
    
    @staticmethod
    def update_department(db: Session, department_id: int, department_data: DepartmentUpdate) -> Optional[Department]:
        """
        Update department
        """
        try:
            department = db.query(Department).filter(Department.id == department_id).first()
            if not department:
                logger.warning(f"Department with ID {department_id} not found for update")
                return None
            
            # Update only provided fields
            update_data = department_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(department, field, value)
            
            db.commit()
            db.refresh(department)
            
            logger.info(f"Department '{department.name}' updated successfully")
            return department
            
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Failed to update department: {str(e)}")
            raise ValueError("Department name already exists")
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error updating department: {str(e)}")
            raise e
    
    @staticmethod
    def delete_department(db: Session, department_id: int) -> bool:
        """
        Delete department
        """
        try:
            department = db.query(Department).filter(Department.id == department_id).first()
            if not department:
                logger.warning(f"Department with ID {department_id} not found for deletion")
                return False
            
            db.delete(department)
            db.commit()
            
            logger.info(f"Department '{department.name}' deleted successfully")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting department: {str(e)}")
            raise e
    
    @staticmethod
    def get_active_departments(db: Session) -> List[Department]:
        """
        Get only active departments
        """
        try:
            departments = db.query(Department).filter(
                Department.status == "Active"
            ).order_by(Department.name).all()
            
            logger.info(f"Retrieved {len(departments)} active departments")
            return departments
        except Exception as e:
            logger.error(f"Error retrieving active departments: {str(e)}")
            raise e