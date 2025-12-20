import secrets
import uuid

from sqlalchemy import Boolean, Column, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    hash = Column(String(255), nullable=False, default=lambda: secrets.token_hex(16))
    email_verified = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    email_verification_expires_at = Column(DateTime(timezone=True), nullable=True)
    clerk_user_id = Column(String(255), unique=True, nullable=True, index=True)
