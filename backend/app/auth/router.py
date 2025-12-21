import secrets
import uuid
from datetime import datetime, timedelta, timezone
import logging
import bcrypt
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from jwt import PyJWTError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.auth.auth import MeResponse, SignupRequest, SignupResponse, VerifyRequest, VerifyResponse
from app.auth.email import send_verification_email
from app.auth.jwt import decode_access_token

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
    existing = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists",
        )

    password_hash = bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode()
    verification_hash, expires_at = _create_verification_token()

    user = User(
        email=email,
        password=password_hash,
        hash=verification_hash,
        email_verified=False,
        email_verification_expires_at=expires_at,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    background_tasks.add_task(send_verification_email, to_email=email, token=verification_hash)
    logger.info(f"Verification email sent to {email}")
    return user


def _verify_token(token: str, db: Session) -> User:
    logger.info(f"Verifying token {token}")
    user = db.execute(select(User).where(User.hash == token)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid token")

    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified",
        )

    if user.email_verification_expires_at and user.email_verification_expires_at < datetime.now(
        timezone.utc
    ):
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Verification token expired",
        )

    new_hash, expires_at = _create_verification_token()
    user.email_verified = True
    user.hash = new_hash
    user.email_verification_expires_at = expires_at

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@auth_router.post("/verify", response_model=VerifyResponse, tags=["auth"])
def verify(payload: VerifyRequest, db: Session = Depends(get_db)) -> VerifyResponse:
    return _verify_token(payload.token, db)


@auth_router.get("/verify", tags=["auth"])
def verify_get(token: str, db: Session = Depends(get_db)):
    return _verify_token(token, db)


def _get_current_user(request: Request, db: Session) -> User:
    session_token = request.cookies.get("session")
    if not session_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing session")

    try:
        payload = decode_access_token(session_token)
    except PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

    user = db.execute(select(User).where(User.id == uuid.UUID(user_id))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@auth_router.get("/me", response_model=MeResponse)
def me(request: Request, db: Session = Depends(get_db)) -> MeResponse:
    return _get_current_user(request, db)
