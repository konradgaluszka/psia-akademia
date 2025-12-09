import secrets

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import SignupRequest, SignupResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> SignupResponse:
    email = payload.email.strip().lower()
    existing = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists",
        )

    password_hash = bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode()
    verification_hash = secrets.token_hex(16)

    user = User(
        email=email,
        password=password_hash,
        hash=verification_hash,
        email_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
