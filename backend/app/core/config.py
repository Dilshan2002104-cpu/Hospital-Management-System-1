try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
from pydantic import field_validator
from typing import List, Union
import os


class Settings(BaseSettings):
    # Database
    database_url: str
    db_host: str = "localhost"
    db_port: int = 3306
    db_user: str
    db_password: str = ""
    db_name: str

    # Application
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Environment
    environment: str = "development"
    debug: bool = True

    # Startup Configuration
    create_default_admin: bool = True  # Set to False to disable auto admin creation

    # CORS - Handle both JSON list and comma-separated string
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    @field_validator('allowed_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()