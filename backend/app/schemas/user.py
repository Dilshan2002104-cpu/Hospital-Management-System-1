from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
import re


class UserBase(BaseModel):
    """Base schema for user - ONLY frontend fields"""
    employee_id: str = Field(..., min_length=3, max_length=50)
    name: str = Field(..., min_length=2, max_length=255)
    role: str = Field(..., min_length=2, max_length=100)
    department_id: int = Field(..., gt=0)

    @validator('employee_id')
    def validate_employee_id(cls, v):
        if not re.match(r'^[A-Z]{2,4}\d{3,6}$', v):
            raise ValueError('Employee ID must be in format: 2-4 letters followed by 3-6 digits (e.g., EMP001)')
        return v.upper()
    
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty or only whitespace')
        # Check for valid name characters
        if not re.match(r'^[a-zA-Z\s\.\-\']+$', v.strip()):
            raise ValueError('Name can only contain letters, spaces, dots, hyphens, and apostrophes')
        return v.strip().title()
    
    @validator('role')
    def validate_role(cls, v):
        allowed_roles = [
            'Doctor', 'Nurse', 'Lab Technician', 'Pharmacist', 
            'Administrator', 'Receptionist', 'Radiologist', 
            'Physiotherapist', 'Dietitian', 'Social Worker'
        ]
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {", ".join(allowed_roles)}')
        return v


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str = Field(..., min_length=6, max_length=255)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserUpdate(BaseModel):
    """Schema for updating a user - ONLY frontend fields"""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    role: Optional[str] = Field(None, min_length=2, max_length=100)
    department_id: Optional[int] = Field(None, gt=0)
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError('Name cannot be empty or only whitespace')
            if not re.match(r'^[a-zA-Z\s\.\-\']+$', v.strip()):
                raise ValueError('Name can only contain letters, spaces, dots, hyphens, and apostrophes')
            return v.strip().title()
        return v
    
    @validator('role')
    def validate_role(cls, v):
        if v is not None:
            allowed_roles = [
                'Doctor', 'Nurse', 'Lab Technician', 'Pharmacist', 
                'Administrator', 'Receptionist', 'Radiologist', 
                'Physiotherapist', 'Dietitian', 'Social Worker'
            ]
            if v not in allowed_roles:
                raise ValueError(f'Role must be one of: {", ".join(allowed_roles)}')
        return v


class UserPasswordUpdate(BaseModel):
    """Schema for updating user password"""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6, max_length=255)
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserResponse(UserBase):
    """Schema for user response - ONLY frontend fields"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    # Department information
    department_name: Optional[str] = None

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Schema for user list response"""
    users: List[UserResponse]
    total: int
    page: int = 1
    per_page: int = 50


class CreateUserResponse(BaseModel):
    """Schema for create user response"""
    success: bool
    message: str
    user: UserResponse


class UserLoginResponse(BaseModel):
    """Schema for user login response"""
    success: bool
    message: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None