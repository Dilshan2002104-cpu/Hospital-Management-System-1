"""
Authentication dependencies for FastAPI routes
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.database.database import get_db
from app.utils.jwt_handler import JWTHandler
from app.models.user import User
from app.services.user_service import UserService

logger = logging.getLogger(__name__)

# Create security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    """
    try:
        # Extract token
        token = credentials.credentials
        
        # Verify token and get payload
        payload = JWTHandler.verify_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Extract user ID
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from database
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.debug(f"Authenticated user: {user.name} ({user.employee_id})")
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_current_user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_roles(allowed_roles: List[str]):
    """
    Dependency factory for role-based access control
    
    Args:
        allowed_roles: List of roles that can access the endpoint
        
    Returns:
        Dependency function that checks user role
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            logger.warning(
                f"Access denied for user {current_user.name} with role {current_user.role}. "
                f"Required roles: {allowed_roles}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        
        logger.debug(f"Role check passed for user {current_user.name} with role {current_user.role}")
        return current_user
    
    return role_checker


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency that requires admin role
    """
    if current_user.role != "Administrator":
        logger.warning(f"Admin access denied for user {current_user.name} with role {current_user.role}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    logger.debug(f"Admin access granted for user {current_user.name}")
    return current_user


def require_department_access(
    department_id: Optional[int] = None,
    allow_admin_override: bool = True
):
    """
    Dependency factory for department-specific access control
    
    Args:
        department_id: Specific department ID to check (if None, checks user's department)
        allow_admin_override: Whether admins can access any department
        
    Returns:
        Dependency function that checks department access
    """
    def department_checker(current_user: User = Depends(get_current_user)) -> User:
        # Admin override
        if allow_admin_override and current_user.role == "Administrator":
            logger.debug(f"Admin override for department access: {current_user.name}")
            return current_user
        
        # Check department access
        target_dept_id = department_id if department_id is not None else current_user.department_id
        
        if current_user.department_id != target_dept_id:
            logger.warning(
                f"Department access denied for user {current_user.name}. "
                f"User department: {current_user.department_id}, Required: {target_dept_id}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Insufficient department permissions"
            )
        
        logger.debug(f"Department access granted for user {current_user.name}")
        return current_user
    
    return department_checker


# Common role combinations
require_medical_staff = require_roles(["Doctor", "Nurse"])
require_lab_staff = require_roles(["Lab Technician", "Doctor"])
require_pharmacy_staff = require_roles(["Pharmacist", "Doctor"])
require_management = require_roles(["Administrator", "Doctor"])


async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if token is provided, but don't require authentication
    Useful for endpoints that behave differently based on authentication status
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        payload = JWTHandler.verify_token(token)
        if not payload:
            return None
        
        user_id = payload.get("user_id")
        if not user_id:
            return None
        
        user = UserService.get_user_by_id(db, user_id)
        return user
        
    except Exception as e:
        logger.debug(f"Optional authentication failed: {str(e)}")
        return None