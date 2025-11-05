"""
Authentication schemas for request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime


class LoginRequest(BaseModel):
    """Schema for login request"""
    employee_id: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1)
    
    @validator('employee_id')
    def validate_employee_id(cls, v):
        if not v.strip():
            raise ValueError('Employee ID cannot be empty')
        return v.strip()


class UserData(BaseModel):
    """Schema for user data in responses"""
    id: int
    employee_id: str
    name: str
    role: str
    department_id: int
    department_name: Optional[str] = None


class LoginResponse(BaseModel):
    """Schema for login response"""
    success: bool
    message: str
    user: UserData
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # Token expiration time in seconds


class RefreshTokenRequest(BaseModel):
    """Schema for token refresh request"""
    token: str = Field(..., min_length=1)


class RefreshTokenResponse(BaseModel):
    """Schema for token refresh response"""
    success: bool
    message: str
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class LogoutResponse(BaseModel):
    """Schema for logout response"""
    success: bool
    message: str


class TokenPayload(BaseModel):
    """Schema for JWT token payload"""
    user_id: int
    employee_id: str
    name: str
    role: str
    department_id: int
    type: str = "access_token"
    exp: datetime
    iat: datetime


class AuthError(BaseModel):
    """Schema for authentication errors"""
    detail: str
    type: str = "authentication_error"


# Role-based access schemas
class RolePermission(BaseModel):
    """Schema for role permissions"""
    role: str
    permissions: list[str]
    description: str


class DepartmentAccess(BaseModel):
    """Schema for department access control"""
    department_id: int
    department_name: str
    allowed_roles: list[str]
    restricted_areas: Optional[list[str]] = None


# Common role definitions
ROLE_PERMISSIONS = {
    "Administrator": {
        "permissions": [
            "user.create", "user.read", "user.update", "user.delete",
            "department.create", "department.read", "department.update", "department.delete",
            "system.admin", "reports.all"
        ],
        "description": "Full system access"
    },
    "Doctor": {
        "permissions": [
            "patient.create", "patient.read", "patient.update",
            "medical_record.create", "medical_record.read", "medical_record.update",
            "prescription.create", "prescription.read", "prescription.update",
            "department.read", "user.read"
        ],
        "description": "Medical staff with patient care access"
    },
    "Nurse": {
        "permissions": [
            "patient.read", "patient.update",
            "medical_record.read", "medical_record.update",
            "prescription.read", "department.read"
        ],
        "description": "Nursing staff with patient care access"
    },
    "Lab Technician": {
        "permissions": [
            "patient.read", "lab_result.create", "lab_result.read", 
            "lab_result.update", "department.read"
        ],
        "description": "Laboratory staff access"
    },
    "Pharmacist": {
        "permissions": [
            "prescription.read", "prescription.update", "medication.create",
            "medication.read", "medication.update", "department.read"
        ],
        "description": "Pharmacy staff access"
    },
    "Receptionist": {
        "permissions": [
            "patient.create", "patient.read", "patient.update",
            "appointment.create", "appointment.read", "appointment.update",
            "department.read"
        ],
        "description": "Front desk and appointment management"
    },
    "Radiologist": {
        "permissions": [
            "patient.read", "imaging.create", "imaging.read", 
            "imaging.update", "department.read"
        ],
        "description": "Radiology department access"
    },
    "Physiotherapist": {
        "permissions": [
            "patient.read", "therapy.create", "therapy.read", 
            "therapy.update", "department.read"
        ],
        "description": "Physical therapy access"
    }
}