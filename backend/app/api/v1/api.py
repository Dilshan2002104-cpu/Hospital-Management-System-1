from fastapi import APIRouter
from app.api.v1.endpoints import departments_router
from app.api.v1.endpoints.users import router as users_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.ward1_monthly_reports import router as ward1_reports_router

api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth_router)

# Include department routes
api_router.include_router(departments_router)

# Include user routes
api_router.include_router(users_router)

# Include Ward 1 monthly reports routes
api_router.include_router(ward1_reports_router)

# Health check for API v1
@api_router.get("/health")
async def api_health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "message": "Hospital Management System API v1 is running"
    }