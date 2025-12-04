import logging
import os

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Core settings
    PROJECT_NAME: str = "Propiscineiro"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Database settings
    DATABASE_URL: str

    # Security settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Token JWT expira em 30 minutos

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

# Initialize settings
settings = Settings()

# Configure logging
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(levelname)s: %(asctime)s - %(name)s - %(message)s"
        },
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(levelname)s %(asctime)s %(name)s %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "INFO",
            "stream": "ext://sys.stdout"
        },
        "json_console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
            "level": "INFO",
            "stream": "ext://sys.stdout"
        }
    },
    "loggers": {
        "": {  # root logger
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False
        },
        "uvicorn": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False
        },
        "uvicorn.access": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False
        },
        "app": { # our app logger
            "handlers": ["console"],
            "level": "DEBUG" if settings.DEBUG else "INFO",
            "propagate": False
        },
        "sqlalchemy": {
            "handlers": ["console"],
            "level": "WARNING", # Keep SQLAlchemy logging to WARNING to avoid verbosity
            "propagate": False
        },
        "alembic": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False
        }
    }
}

