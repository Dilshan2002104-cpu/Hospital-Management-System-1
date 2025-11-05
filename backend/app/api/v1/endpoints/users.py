from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.user_service import UserService
from app.schemas.user import (
    UserCreate, 
    UserUpdate,
    UserPasswordUpdate,
    UserResponse, 
    UserListResponse,
    CreateUserResponse
)
from app.utils.auth_dependencies import (
    get_current_user, 
    require_admin, 
    require_roles,
    require_management
)
from app.models.user import User
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=CreateUserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Create a new system user - ONLY frontend fields
    
    - **employee_id**: Unique employee identifier (e.g., EMP001)
    - **name**: Full name of the user
    - **password**: Password for system access
    - **role**: User role (Doctor, Nurse, etc.)
    - **department_id**: ID of the department user belongs to
    """
    try:
        logger.info(f"Creating new user: {user_data.name} ({user_data.employee_id})")
        
        # Check if employee ID already exists
        existing_user = UserService.get_user_by_employee_id(db, user_data.employee_id)
        if existing_user:
            logger.warning(f"Employee ID '{user_data.employee_id}' already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee ID '{user_data.employee_id}' already exists"
            )
        

        
        # Create the user
        new_user = UserService.create_user(db, user_data)
        
        # Prepare response with department name
        user_response = UserResponse.from_orm(new_user)
        user_response.department_name = new_user.department.name if new_user.department else None
        
        return CreateUserResponse(
            success=True,
            message=f"User '{new_user.name}' created successfully",
            user=user_response
        )
        
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while creating user"
        )


@router.get("/", response_model=UserListResponse)
async def get_all_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of users to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_management)
):
    """
    Get all system users with pagination - simplified
    
    - **skip**: Number of users to skip (for pagination)
    - **limit**: Maximum number of users to return (1-100)
    """
    try:
        logger.info(f"Retrieving users: skip={skip}, limit={limit}")
        
        # Test database connection first
        try:
            users = UserService.get_all_users(db, skip=skip, limit=limit)
            logger.info(f"Successfully retrieved {len(users)} users from database")
        except Exception as db_error:
            logger.error(f"Database error retrieving users: {str(db_error)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(db_error)}"
            )
        
        # Convert to response format with department names
        user_responses = []
        for user in users:
            try:
                # Create response manually to avoid from_orm issues
                user_response = UserResponse(
                    id=user.id,
                    employee_id=user.employee_id,
                    name=user.name,
                    role=user.role,
                    department_id=user.department_id,
                    created_at=user.created_at,
                    updated_at=user.updated_at,
                    department_name=user.department.name if user.department else None
                )
                user_responses.append(user_response)
            except Exception as user_error:
                logger.error(f"Error processing user {user.id}: {user_error}")
                continue
        
        # Get total count for pagination
        try:
            total = len(UserService.get_all_users(db, skip=0, limit=10000))
        except Exception as count_error:
            logger.warning(f"Error getting total count: {count_error}")
            total = len(user_responses)  # Fallback to current count
        
        logger.info(f"Successfully processed {len(user_responses)} user responses")
        
        return UserListResponse(
            users=user_responses,
            total=total,
            page=(skip // limit) + 1,
            per_page=limit
        )
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except Exception as e:
        logger.error(f"Unexpected error retrieving users: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error while retrieving users: {str(e)}"
        )



@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get user by ID
    """
    try:
        logger.info(f"Retrieving user with ID: {user_id}")
        user = UserService.get_user_by_id(db, user_id)
        
        if not user:
            logger.warning(f"User with ID {user_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        user_response = UserResponse.from_orm(user)
        user_response.department_name = user.department.name if user.department else None
        
        return user_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while retrieving user"
        )


@router.get("/employee/{employee_id}", response_model=UserResponse)
async def get_user_by_employee_id(employee_id: str, db: Session = Depends(get_db)):
    """
    Get user by employee ID
    """
    try:
        logger.info(f"Retrieving user with employee ID: {employee_id}")
        user = UserService.get_user_by_employee_id(db, employee_id)
        
        if not user:
            logger.warning(f"User with employee ID {employee_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with employee ID {employee_id} not found"
            )
        
        user_response = UserResponse.from_orm(user)
        user_response.department_name = user.department.name if user.department else None
        
        return user_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user by employee ID {employee_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while retrieving user"
        )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    """
    Update user information
    """
    try:
        logger.info(f"Updating user with ID: {user_id}")
        
        updated_user = UserService.update_user(db, user_id, user_data)
        
        if not updated_user:
            logger.warning(f"User with ID {user_id} not found for update")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        user_response = UserResponse.from_orm(updated_user)
        user_response.department_name = updated_user.department.name if updated_user.department else None
        
        return user_response
        
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while updating user"
        )


@router.put("/{user_id}/password")
async def update_password(
    user_id: int,
    password_data: UserPasswordUpdate,
    db: Session = Depends(get_db)
):
    """
    Update user password
    """
    try:
        logger.info(f"Updating password for user ID: {user_id}")
        
        success = UserService.update_password(db, user_id, password_data)
        
        if not success:
            logger.warning(f"User with ID {user_id} not found for password update")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        return {"success": True, "message": "Password updated successfully"}
        
    except ValueError as ve:
        logger.error(f"Password update error: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Error updating password for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while updating password"
        )


@router.delete("/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Deactivate user (soft delete)
    """
    try:
        logger.info(f"Deactivating user with ID: {user_id}")
        
        success = UserService.delete_user(db, user_id)
        
        if not success:
            logger.warning(f"User with ID {user_id} not found for deactivation")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        return {"success": True, "message": "User deactivated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deactivating user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while deactivating user"
        )


@router.get("/search/{search_term}", response_model=UserListResponse)
async def search_users(
    search_term: str,
    limit: int = Query(50, ge=1, le=100, description="Maximum number of users to return"),
    db: Session = Depends(get_db)
):
    """
    Search users by name or employee ID
    """
    try:
        logger.info(f"Searching users with term: {search_term}")
        
        users = UserService.search_users(db, search_term, limit)
        
        user_responses = []
        for user in users:
            user_response = UserResponse.from_orm(user)
            user_response.department_name = user.department.name if user.department else None
            user_responses.append(user_response)
        
        return UserListResponse(
            users=user_responses,
            total=len(user_responses),
            page=1,
            per_page=len(user_responses)
        )
        
    except Exception as e:
        logger.error(f"Error searching users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while searching users"
        )


@router.get("/department/{department_id}", response_model=UserListResponse)
async def get_users_by_department(department_id: int, db: Session = Depends(get_db)):
    """
    Get all users in a specific department
    """
    try:
        logger.info(f"Retrieving users for department ID: {department_id}")
        
        users = UserService.get_users_by_department(db, department_id)
        
        user_responses = []
        for user in users:
            user_response = UserResponse.from_orm(user)
            user_response.department_name = user.department.name if user.department else None
            user_responses.append(user_response)
        
        return UserListResponse(
            users=user_responses,
            total=len(user_responses),
            page=1,
            per_page=len(user_responses)
        )
        
    except Exception as e:
        logger.error(f"Error retrieving users by department: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while retrieving users by department"
        )


@router.get("/role/{role}", response_model=UserListResponse)
async def get_users_by_role(role: str, db: Session = Depends(get_db)):
    """
    Get all users with a specific role
    """
    try:
        logger.info(f"Retrieving users with role: {role}")
        
        users = UserService.get_users_by_role(db, role)
        
        user_responses = []
        for user in users:
            user_response = UserResponse.from_orm(user)
            user_response.department_name = user.department.name if user.department else None
            user_responses.append(user_response)
        
        return UserListResponse(
            users=user_responses,
            total=len(user_responses),
            page=1,
            per_page=len(user_responses)
        )
        
    except Exception as e:
        logger.error(f"Error retrieving users by role: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while retrieving users by role"
        )