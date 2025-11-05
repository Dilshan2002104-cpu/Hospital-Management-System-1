from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, or_
from app.models.user import User
from app.models.department import Department
from app.schemas.user import UserCreate, UserUpdate, UserPasswordUpdate
from typing import Optional, List
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class UserService:
    """Service class for user operations"""
    
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """
        Create a new user
        """
        try:
            # Check if department exists and is active
            department = db.query(Department).filter(
                and_(Department.id == user_data.department_id, Department.status == "Active")
            ).first()
            
            if not department:
                raise ValueError(f"Department with ID {user_data.department_id} not found or inactive")
            
            # Create user object - ONLY frontend fields
            db_user = User(
                employee_id=user_data.employee_id,
                name=user_data.name,
                role=user_data.role,
                department_id=user_data.department_id
            )
            
            # Set password
            db_user.set_password(user_data.password)
            
            # Add to database
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
            logger.info(f"User '{db_user.name}' ({db_user.employee_id}) created successfully")
            return db_user
            
        except IntegrityError as e:
            db.rollback()
            error_msg = str(e.orig)
            if "employee_id" in error_msg:
                raise ValueError(f"Employee ID '{user_data.employee_id}' already exists")
            else:
                raise ValueError("Failed to create user due to data constraint violation")
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error creating user: {str(e)}")
            raise e
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Get all users with pagination - simplified
        """
        try:
            # Use LEFT JOIN to include users even if department is missing
            from sqlalchemy.orm import joinedload
            query = db.query(User).options(joinedload(User.department))
            users = query.offset(skip).limit(limit).all()
            logger.info(f"Retrieved {len(users)} users")
            return users
            
        except Exception as e:
            logger.error(f"Error retrieving users: {str(e)}")
            raise e
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """
        Get user by ID
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                logger.info(f"Retrieved user: {user.name} ({user.employee_id})")
            else:
                logger.warning(f"User with ID {user_id} not found")
            return user
        except Exception as e:
            logger.error(f"Error retrieving user by ID {user_id}: {str(e)}")
            raise e
    
    @staticmethod
    def get_user_by_employee_id(db: Session, employee_id: str) -> Optional[User]:
        """
        Get user by employee ID
        """
        try:
            user = db.query(User).filter(User.employee_id == employee_id).first()
            return user
        except Exception as e:
            logger.error(f"Error retrieving user by employee ID '{employee_id}': {str(e)}")
            raise e
    

    
    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """
        Update user
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.warning(f"User with ID {user_id} not found for update")
                return None
            
            # Validate department if being updated
            if user_data.department_id:
                department = db.query(Department).filter(
                    Department.id == user_data.department_id
                ).first()
                if not department:
                    raise ValueError(f"Department with ID {user_data.department_id} not found")
            
            # Update only provided fields
            update_data = user_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                if hasattr(user, field):
                    setattr(user, field, value)
            
            user.updated_at = datetime.utcnow()
            
            db.commit()
            db.refresh(user)
            
            logger.info(f"User '{user.name}' updated successfully")
            return user
            
        except IntegrityError as e:
            db.rollback()
            error_msg = str(e.orig)
            raise ValueError("Failed to update user due to data constraint violation")
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error updating user: {str(e)}")
            raise e
    
    @staticmethod
    def update_password(db: Session, user_id: int, password_data: UserPasswordUpdate) -> bool:
        """
        Update user password
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.warning(f"User with ID {user_id} not found for password update")
                return False
            
            # Verify current password
            if not user.check_password(password_data.current_password):
                raise ValueError("Current password is incorrect")
            
            # Set new password
            user.set_password(password_data.new_password)
            user.updated_at = datetime.utcnow()
            
            db.commit()
            
            logger.info(f"Password updated for user '{user.name}'")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating password: {str(e)}")
            raise e
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """
        Delete user (hard delete since no status field)
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.warning(f"User with ID {user_id} not found for deletion")
                return False
            
            # Hard delete since we don't have status field
            db.delete(user)
            db.commit()
            
            logger.info(f"User '{user.name}' deleted successfully")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting user: {str(e)}")
            raise e
    
    @staticmethod
    def hard_delete_user(db: Session, user_id: int) -> bool:
        """
        Permanently delete user (use with caution)
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.warning(f"User with ID {user_id} not found for deletion")
                return False
            
            db.delete(user)
            db.commit()
            
            logger.info(f"User '{user.name}' permanently deleted")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error permanently deleting user: {str(e)}")
            raise e
    
    @staticmethod
    def authenticate_user(db: Session, employee_id: str, password: str) -> Optional[User]:
        """
        Authenticate user by employee ID and password
        """
        try:
            user = UserService.get_user_by_employee_id(db, employee_id)
            if user and user.check_password(password):
                logger.info(f"User '{user.name}' authenticated successfully")
                return user
            
            logger.warning(f"Authentication failed for employee ID: {employee_id}")
            return None
            
        except Exception as e:
            logger.error(f"Error authenticating user: {str(e)}")
            raise e
    
    @staticmethod
    def search_users(db: Session, search_term: str, limit: int = 50) -> List[User]:
        """
        Search users by name or employee ID
        """
        try:
            search_pattern = f"%{search_term}%"
            users = db.query(User).filter(
                or_(
                    User.name.ilike(search_pattern),
                    User.employee_id.ilike(search_pattern)
                )
            ).limit(limit).all()
            
            logger.info(f"Found {len(users)} users matching search term: {search_term}")
            return users
            
        except Exception as e:
            logger.error(f"Error searching users: {str(e)}")
            raise e
    
    @staticmethod
    def get_users_by_department(db: Session, department_id: int) -> List[User]:
        """
        Get all users in a specific department
        """
        try:
            users = db.query(User).filter(User.department_id == department_id).all()
            
            logger.info(f"Retrieved {len(users)} users from department ID {department_id}")
            return users
            
        except Exception as e:
            logger.error(f"Error retrieving users by department: {str(e)}")
            raise e
    
    @staticmethod
    def get_users_by_role(db: Session, role: str) -> List[User]:
        """
        Get all users with a specific role
        """
        try:
            users = db.query(User).filter(User.role == role).all()
            
            logger.info(f"Retrieved {len(users)} users with role: {role}")
            return users
            
        except Exception as e:
            logger.error(f"Error retrieving users by role: {str(e)}")
            raise e