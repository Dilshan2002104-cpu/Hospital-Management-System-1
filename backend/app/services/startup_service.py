"""
Startup Service for Hospital Management System
Handles automatic creation of default system admin credentials on first startup
"""
import logging
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.department import Department
from app.core.config import settings

logger = logging.getLogger(__name__)


class StartupService:
    """Service for handling system startup tasks"""
    
    @staticmethod
    def create_default_admin_department(db: Session) -> Department:
        """Create default Administration department if it doesn't exist"""
        try:
            admin_dept = db.query(Department).filter(Department.name == "Administration").first()
            
            if not admin_dept:
                admin_dept = Department(
                    name="Administration",
                    status="Active"
                )
                db.add(admin_dept)
                db.commit()
                db.refresh(admin_dept)
                logger.info("✅ Created default Administration department")
            else:
                logger.info("ℹ️  Administration department already exists")
            
            return admin_dept
            
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create Administration department: {e}")
            raise e
    
    @staticmethod
    def create_default_admin_user(db: Session, admin_dept: Department) -> bool:
        """Create default system administrator if it doesn't exist"""
        try:
            # Check if default admin already exists
            existing_admin = db.query(User).filter(User.employee_id == "ADMIN001").first()
            
            if existing_admin:
                logger.info("ℹ️  Default admin user (ADMIN001) already exists - skipping creation")
                return False
            
            # Create default admin user
            admin_user = User(
                employee_id="ADMIN001",
                name="System Administrator",
                role="Administrator",
                department_id=admin_dept.id
            )
            
            # Set default password
            admin_user.set_password("admin123")
            
            db.add(admin_user)
            db.commit()
            
            logger.info("✅ Created default admin user - ADMIN001")
            logger.info("🔐 Default admin credentials:")
            logger.info("   Employee ID: ADMIN001")
            logger.info("   Password: admin123")
            logger.warning("⚠️  SECURITY: Please change the default password after first login!")
            
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create default admin user: {e}")
            raise e
    
    @staticmethod
    def initialize_default_credentials():
        """Main function to initialize default admin credentials on startup"""
        try:
            logger.info("🚀 Initializing default system credentials...")
            
            # Get database session
            db = next(get_db())
            
            try:
                # Create default admin department
                admin_dept = StartupService.create_default_admin_department(db)
                
                # Create default admin user
                admin_created = StartupService.create_default_admin_user(db, admin_dept)
                
                if admin_created:
                    logger.info("🎉 Default admin credentials initialized successfully!")
                    logger.info("📋 You can now login with:")
                    logger.info("   URL: http://localhost:8000/docs")
                    logger.info("   Employee ID: ADMIN001")
                    logger.info("   Password: admin123")
                else:
                    logger.info("✅ System already has admin credentials configured")
                    
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"❌ Failed to initialize default credentials: {e}")
            raise e


def run_startup_initialization():
    """Function to be called during application startup"""
    try:
        # Check if auto admin creation is enabled
        if not settings.create_default_admin:
            logger.info("🔒 Default admin creation is disabled in configuration")
            return
            
        StartupService.initialize_default_credentials()
    except Exception as e:
        logger.error(f"Startup initialization failed: {e}")
        # Don't raise the exception to prevent app startup failure
        # Just log the error and continue