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
    jwt_secret: str = Field(default="dev-change-me", env="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", env="JWT_ALGORITHM")
    jwt_exp_minutes: int = Field(default=60 * 24 * 7, env="JWT_EXP_MINUTES")

    model_config = SettingsConfigDict(env_file=".env.example", case_sensitive=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()
