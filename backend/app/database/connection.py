from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


def test_database_connection():
    """Test database connection"""
    try:
        engine = create_engine(settings.database_url)
        connection = engine.connect()
        connection.close()
        logger.info("Database connection successful!")
        return True
    except SQLAlchemyError as e:
        logger.error(f"Database connection failed: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error during database connection: {e}")
        return False


def create_database_if_not_exists():
    """Create database if it doesn't exist"""
    try:
        # Connect without specifying database
        base_url = f"mysql+pymysql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}"
        engine = create_engine(base_url)
        
        with engine.connect() as connection:
            # Use text() for raw SQL in SQLAlchemy 2.0
            from sqlalchemy import text
            connection.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.db_name}"))
            connection.commit()
            logger.info(f"Database '{settings.db_name}' created or already exists")
            
    except SQLAlchemyError as e:
        logger.error(f"Failed to create database: {e}")
        raise e