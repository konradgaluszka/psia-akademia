import os
import secrets
from datetime import datetime, timedelta, timezone
import logging
import bcrypt
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.user.user import User
from app.auth.plain.auth import LoginRequest, LoginResponse, SignupRequest, SignupResponse, VerifyRequest, VerifyResponse
from app.auth.plain.email import send_verification_email
from app.auth.plain.plain_auth_model import PlainAuth
from app.auth.utils.jwt import create_access_token

auth_router = APIRouter(prefix="/auth", tags=["auth"])

VERIFICATION_TTL_HOURS = 24
logger = logging.getLogger(__name__)

def _create_verification_token() -> tuple[str, datetime]:
    token = secrets.token_hex(24)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=VERIFICATION_TTL_HOURS)
    return token, expires_at


@auth_router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(
    payload: SignupRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> SignupResponse:
    email = payload.email.strip().lower()
    existing_user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists",
        )

    password_hash = bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode()
    verification_hash, expires_at = _create_verification_token()

    user = User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)

    plain_auth = PlainAuth(
        user_id=user.id,
        password=password_hash,
        hash=verification_hash,
        email_verified=False,
        email_verification_expires_at=expires_at,
    )
    db.add(plain_auth)
    db.commit()
    db.refresh(plain_auth)

    background_tasks.add_task(send_verification_email, to_email=email, token=verification_hash)
    logger.info(f"Verification email sent to {email}")
    return SignupResponse(
        id=user.id,
        email=user.email,
        email_verified=plain_auth.email_verified,
        created_at=user.created_at,
    )


@auth_router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)) -> LoginResponse:
    email = payload.email.strip().lower()
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    plain_auth = db.execute(
        select(PlainAuth).where(PlainAuth.user_id == user.id)
    ).scalar_one_or_none()
    if not plain_auth:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not bcrypt.checkpw(payload.password.encode(), plain_auth.password.encode()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not plain_auth.email_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified")

    session_cookie = create_access_token(str(user.id))
    response.set_cookie(
        key="session",
        value=session_cookie,
        httponly=True,
        secure=os.getenv("ENV", "development") == "production",
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
        path="/",
    )

    return LoginResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
    )


def _verify_token(token: str, db: Session) -> VerifyResponse:
    logger.info(f"Verifying token {token}")
    plain_auth = db.execute(select(PlainAuth).where(PlainAuth.hash == token)).scalar_one_or_none()
    if not plain_auth:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid token")

    if plain_auth.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified",
        )

    if plain_auth.email_verification_expires_at and plain_auth.email_verification_expires_at < datetime.now(
        timezone.utc
    ):
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Verification token expired",
        )

    new_hash, expires_at = _create_verification_token()
    plain_auth.email_verified = True
    plain_auth.hash = new_hash
    plain_auth.email_verification_expires_at = expires_at

    db.add(plain_auth)
    db.commit()
    db.refresh(plain_auth)
    user = db.execute(select(User).where(User.id == plain_auth.user_id)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return VerifyResponse(
        id=user.id,
        email=user.email,
        email_verified=plain_auth.email_verified,
        created_at=user.created_at,
    )


@auth_router.post("/verify", response_model=VerifyResponse, tags=["auth"])
def verify(payload: VerifyRequest, db: Session = Depends(get_db)) -> VerifyResponse:
    return _verify_token(payload.token, db)


@auth_router.get("/verify", tags=["auth"])
def verify_get(token: str, db: Session = Depends(get_db)):
    return _verify_token(token, db)
