from functools import lru_cache
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/psy",
        env="DATABASE_URL",
    )
    verification_base_url: str = Field(
        default="http://localhost:8000/verify", env="VERIFICATION_BASE_URL"
    )
    smtp_host: Optional[str] = Field(default=None, env="SMTP_HOST")
    smtp_port: int = Field(default=587, env="SMTP_PORT")
    smtp_user: Optional[str] = Field(default=None, env="SMTP_USER")
    smtp_password: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    email_from: str = Field(default="no-reply@example.com", env="EMAIL_FROM")
    clerk_jwt_issuer: Optional[str] = Field(default=None, env="CLERK_JWT_ISSUER")
    clerk_jwks_url: Optional[str] = Field(default=None, env="CLERK_JWKS_URL")
    clerk_jwt_audience: Optional[str] = Field(default=None, env="CLERK_JWT_AUDIENCE")

    model_config = SettingsConfigDict(env_file=".env.example", case_sensitive=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()
