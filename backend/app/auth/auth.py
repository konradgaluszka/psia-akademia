import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=8, description="User password")


class SignupResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    email_verified: bool
    created_at: datetime

    class Config:
        orm_mode = True


class VerifyRequest(BaseModel):
    token: str = Field(..., description="Verification token")


class VerifyResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    email_verified: bool
    created_at: datetime

    class Config:
        orm_mode = True


class ClerkOAuthRequest(BaseModel):
    token: str = Field(..., description="Clerk JWT")


class ClerkOAuthResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    email_verified: bool
    created_at: datetime
    clerk_user_id: Optional[str] = None

    class Config:
        orm_mode = True
