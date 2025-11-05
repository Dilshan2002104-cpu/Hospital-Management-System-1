"""
Authentication endpoints for login, logout, and token management
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import logging

from app.database.database import get_db
from app.services.user_service import UserService
from app.utils.jwt_handler import JWTHandler
from app.utils.auth_dependencies import get_current_user
from app.schemas.auth import (
    LoginRequest, 
    LoginResponse, 
    RefreshTokenRequest,
    RefreshTokenResponse,
    LogoutResponse
)
from app.models.user import User
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return JWT token
    
    - **employee_id**: User's employee ID
    - **password**: User's password
    """
    try:
        # Authenticate user
        user = UserService.authenticate_user(
            db, 
            login_data.employee_id, 
            login_data.password
        )
        
        if not user:
            logger.warning(f"Login failed for employee ID: {login_data.employee_id}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid employee ID or password"
            )
        
        # Create JWT token
        token_data = JWTHandler.create_user_token_data(user)
        access_token = JWTHandler.create_access_token(data=token_data)
        
        # Prepare user data for response
        user_data = {
            "id": user.id,
            "employee_id": user.employee_id,
            "name": user.name,
            "role": user.role,
            "department_id": user.department_id,
            "department_name": user.department.name if user.department else None
        }
        
        logger.info(f"Successful login for user: {user.name} ({user.employee_id})")
        
        return LoginResponse(
            success=True,
            message="Login successful",
            user=user_data,
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60  # Convert to seconds
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh JWT token
    
    - **token**: Current JWT token to refresh
    """
    try:
        # Verify current token
        payload = JWTHandler.verify_token(refresh_data.token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        # Get user from database to ensure they still exist
        user_id = payload.get("user_id")
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new token with updated data
        token_data = JWTHandler.create_user_token_data(user)
        new_access_token = JWTHandler.create_access_token(data=token_data)
        
        logger.info(f"Token refreshed for user: {user.name} ({user.employee_id})")
        
        return RefreshTokenResponse(
            success=True,
            message="Token refreshed successfully",
            access_token=new_access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during token refresh"
        )


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    current_user: User = Depends(get_current_user)
):
    """
    Logout user (token blacklisting would be implemented here in production)
    """
    try:
        # In a production system, you would blacklist the token here
        # For now, we'll just log the logout
        
        logger.info(f"User logged out: {current_user.name} ({current_user.employee_id})")
        
        return LogoutResponse(
            success=True,
            message="Logout successful"
        )
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during logout"
        )


@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information
    """
    try:
        user_data = {
            "id": current_user.id,
            "employee_id": current_user.employee_id,
            "name": current_user.name,
            "role": current_user.role,
            "department_id": current_user.department_id,
            "department_name": current_user.department.name if current_user.department else None,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
            "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
        }
        
        return {
            "success": True,
            "user": user_data
        }
        
    except Exception as e:
        logger.error(f"Get user info error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )