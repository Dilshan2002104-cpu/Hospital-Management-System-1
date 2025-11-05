from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional


class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Department name")
    status: str = Field(default="Active", description="Department status")


class DepartmentCreate(DepartmentBase):
    """Schema for creating a new department"""
    
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Department name cannot be empty or only whitespace')
        return v.strip().title()  # Capitalize first letter of each word
    
    @validator('status')
    def validate_status(cls, v):
        allowed_statuses = ['Active', 'Inactive']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class DepartmentUpdate(BaseModel):
    """Schema for updating a department"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError('Department name cannot be empty or only whitespace')
            return v.strip().title()
        return v
    
    @validator('status')
    def validate_status(cls, v):
        if v is not None:
            allowed_statuses = ['Active', 'Inactive']
            if v not in allowed_statuses:
                raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class DepartmentResponse(DepartmentBase):
    """Schema for department response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DepartmentListResponse(BaseModel):
    """Schema for department list response"""
    departments: list[DepartmentResponse]
    total: int
    
    
class CreateDepartmentResponse(BaseModel):
    """Schema for create department response"""
    success: bool
    message: str
    department: DepartmentResponse