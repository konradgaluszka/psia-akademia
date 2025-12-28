import uuid
from datetime import datetime

import os

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from jwt import PyJWTError
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.utils.jwt import decode_access_token
from app.core.database import get_db
from app.user.user import User

auth_router = APIRouter(prefix="/auth", tags=["auth"])


class MeResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    role: str

    class Config:
        orm_mode = True


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


@auth_router.post("/logout")
def logout(response: Response) -> dict[str, str]:
    response.set_cookie(
        key="session",
        value="",
        httponly=True,
        secure=os.getenv("ENV", "development") == "production",
        samesite="lax",
        max_age=0,
        path="/",
    )
    return {"status": "ok"}
