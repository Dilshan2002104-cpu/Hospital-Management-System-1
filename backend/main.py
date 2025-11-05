from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.database.connection import test_database_connection, create_database_if_not_exists
from app.database.database import create_tables
from app.api.v1.api import api_router
from app.services.startup_service import run_startup_initialization
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    logger.info("Starting Hospital Management System API...")
    
    # Create database if it doesn't exist
    try:
        create_database_if_not_exists()
        
        # Test database connection
        if test_database_connection():
            logger.info("Database connection established successfully")
            
            # Create database tables
            create_tables()
            logger.info("Database tables created successfully")
            
            # Initialize default admin credentials
            run_startup_initialization()
            
        else:
            logger.error("Failed to establish database connection")
            
    except Exception as e:
        logger.error(f"Startup error: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Hospital Management System API...")


app = FastAPI(
    title="Hospital Management System API",
    description="A comprehensive hospital management system API",
    version="1.0.0",
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url="/redoc" if settings.environment == "development" else None,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "Hospital Management System API",
        "version": "1.0.0",
        "status": "running",
        "environment": settings.environment
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    db_status = test_database_connection()
    return {
        "status": "healthy" if db_status else "unhealthy",
        "database": "connected" if db_status else "disconnected",
        "environment": settings.environment
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )