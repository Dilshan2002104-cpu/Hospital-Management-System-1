"""
JWT Token Handler for authentication and authorization
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class JWTHandler:
    """Handle JWT token creation, validation, and extraction"""
    
    @staticmethod
    def create_access_token(
        data: Dict[str, Any], 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create JWT access token
        
        Args:
            data: Data to encode in token (user_id, employee_id, role, department_id)
            expires_delta: Custom expiration time (optional)
            
        Returns:
            JWT token string
        """
        try:
            to_encode = data.copy()
            
            # Set expiration
            if expires_delta:
                expire = datetime.utcnow() + expires_delta
            else:
                expire = datetime.utcnow() + timedelta(
                    minutes=settings.access_token_expire_minutes
                )
            
            to_encode.update({"exp": expire, "iat": datetime.utcnow()})
            
            # Create token
            encoded_jwt = jwt.encode(
                to_encode, 
                settings.secret_key, 
                algorithm=settings.algorithm
            )
            
            logger.info(f"JWT token created for user_id: {data.get('user_id')}")
            return encoded_jwt
            
        except Exception as e:
            logger.error(f"Error creating JWT token: {str(e)}")
            raise Exception("Failed to create access token")
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verify and decode JWT token
        
        Args:
            token: JWT token string
            
        Returns:
            Decoded token payload or None if invalid
        """
        try:
            payload = jwt.decode(
                token, 
                settings.secret_key, 
                algorithms=[settings.algorithm]
            )
            
            # Check if token has expired
            exp_timestamp = payload.get("exp")
            if exp_timestamp and datetime.utcnow() > datetime.fromtimestamp(exp_timestamp):
                logger.warning("JWT token has expired")
                return None
            
            logger.debug(f"JWT token verified for user_id: {payload.get('user_id')}")
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.warning("JWT token has expired")
            return None
        except jwt.JWTError as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error verifying JWT token: {str(e)}")
            return None
    
    @staticmethod
    def create_user_token_data(user) -> Dict[str, Any]:
        """
        Create token data from user object
        
        Args:
            user: User model instance
            
        Returns:
            Dictionary with user data for token
        """
        return {
            "user_id": user.id,
            "employee_id": user.employee_id,
            "name": user.name,
            "role": user.role,
            "department_id": user.department_id,
            "type": "access_token"
        }
    
    @staticmethod
    def extract_user_id_from_token(token: str) -> Optional[int]:
        """
        Extract user ID from JWT token
        
        Args:
            token: JWT token string
            
        Returns:
            User ID or None if token invalid
        """
        payload = JWTHandler.verify_token(token)
        if payload:
            return payload.get("user_id")
        return None
    
    @staticmethod
    def extract_user_role_from_token(token: str) -> Optional[str]:
        """
        Extract user role from JWT token
        
        Args:
            token: JWT token string
            
        Returns:
            User role or None if token invalid
        """
        payload = JWTHandler.verify_token(token)
        if payload:
            return payload.get("role")
        return None
    
    @staticmethod
    def extract_department_id_from_token(token: str) -> Optional[int]:
        """
        Extract department ID from JWT token
        
        Args:
            token: JWT token string
            
        Returns:
            Department ID or None if token invalid
        """
        payload = JWTHandler.verify_token(token)
        if payload:
            return payload.get("department_id")
        return None