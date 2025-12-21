import os
import logging
import secrets
import urllib.parse
from typing import Optional

import httpx
import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from fastapi import Response, Request
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.facebook.facebook import facebook_settings
from app.auth.utils import generate_state
from app.auth.jwt import create_access_token
from app.core.database import get_db
from app.models.user import User

auth_router = APIRouter(prefix="/facebook/auth", tags=["auth"])
logger = logging.getLogger(__name__)

FACEBOOK_AUTH_URL = "https://www.facebook.com/v21.0/dialog/oauth"
FACEBOOK_TOKEN_URL = "https://graph.facebook.com/v21.0/oauth/access_token"
FACEBOOK_ME_URL = "https://graph.facebook.com/me"

@auth_router.get("/login")
async def facebook_login(response: Response):
    state = generate_state()

    response = RedirectResponse(
        url=build_facebook_authorize_url(state),
        status_code=302
    )
    response.set_cookie(
        key="fb_oauth_state",
        value=state,
        httponly=True,
        secure=os.getenv("ENV", "development") == "production",
        samesite="lax",
    )
    return response


@auth_router.get("/callback")
async def facebook_callback(request: Request, db: Session = Depends(get_db)):
    logger.info("facebook_auth.callback_start query=%s", dict(request.query_params))
    # 1. Get query params
    code = request.query_params.get("code")
    state = request.query_params.get("state")
    if not code or not state:
        logger.warning("facebook_auth.callback_missing_params code=%s state=%s", bool(code), bool(state))
        raise HTTPException(status_code=400, detail="Missing code or state")

    # 2. Validate state
    cookie_state = request.cookies.get("fb_oauth_state")
    if not cookie_state or cookie_state != state:
        logger.warning("facebook_auth.callback_invalid_state cookie_present=%s", bool(cookie_state))
        raise HTTPException(status_code=400, detail="Invalid state")

    # 3. Exchange code -> access token
    async with httpx.AsyncClient() as client:
        token_resp = await client.get(
            FACEBOOK_TOKEN_URL,
            params={
                "client_id": facebook_settings.facebook_client_id,
                "client_secret": facebook_settings.facebook_client_secret,
                "redirect_uri": facebook_settings.facebook_redirect_uri,
                "code": code,
            },
            timeout=10,
        )
    if token_resp.status_code != 200:
        logger.error("facebook_auth.token_exchange_failed status=%s body=%s", token_resp.status_code, token_resp.text)
        raise HTTPException(
            status_code=400,
            detail=f"Error exchanging code: {token_resp.text}",
        )
    token_data = token_resp.json()
    access_token = token_data.get("access_token")
    if not access_token:
        logger.error("facebook_auth.missing_access_token token_data=%s", token_data)
        raise HTTPException(status_code=400, detail="No access token in response")

    # 4. Fetch user profile from Graph API
    async with httpx.AsyncClient() as client:
        me_resp = await client.get(
            FACEBOOK_ME_URL,
            params={
                "fields": "id,name,email",
                "access_token": access_token,
            },
            timeout=10,
        )
    if me_resp.status_code != 200:
        logger.error("facebook_auth.profile_fetch_failed status=%s body=%s", me_resp.status_code, me_resp.text)
        raise HTTPException(
            status_code=400,
            detail=f"Error fetching user profile: {me_resp.text}",
        )

    me = me_resp.json()
    fb_id = me.get("id")
    email = me.get("email")
    name = me.get("name")

    if not fb_id:
        logger.error("facebook_auth.missing_fb_id profile=%s", me)
        raise HTTPException(status_code=400, detail="No Facebook ID in profile")

    # 5. Find or create local user
    user = await find_or_create_user_from_facebook(fb_id, email, name, db)
    logger.info("facebook_auth.user_ready user_id=%s", user.id)

    # 6. Create your own session (cookie or JWT)
    session_cookie = create_access_token(str(user.id))
    logger.info("facebook_auth.session_created user_id=%s", user.id)

    # 7. Redirect back to frontend with session established
    redirect = RedirectResponse(url="http://localhost:3000")  # or your dashboard
    redirect.set_cookie(
        key="session",
        value=session_cookie,
        httponly=True,
        secure=os.getenv("ENV", "development") == "production",
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    logger.info("facebook_auth.redirect_success user_id=%s", user.id)
    return redirect


async def find_or_create_user_from_facebook(
    fb_id: str,
    email: Optional[str],
    name: Optional[str],
    db: Session,
) -> User:
    logger.info("facebook_auth.find_or_create_user start fb_id=%s email=%s", fb_id, email)
    if not email:
        logger.warning("facebook_auth.missing_email fb_id=%s", fb_id)
        raise HTTPException(status_code=400, detail="Facebook account has no email")

    normalized_email = email.strip().lower()
    logger.debug("facebook_auth.normalized_email email=%s", normalized_email)
    user = db.execute(select(User).where(User.email == normalized_email)).scalar_one_or_none()
    if user:
        logger.info("facebook_auth.user_found email=%s user_id=%s", normalized_email, user.id)
        if not user.email_verified:
            user.email_verified = True
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info("facebook_auth.user_verified email=%s user_id=%s", normalized_email, user.id)
        return user

    password_hash = bcrypt.hashpw(secrets.token_urlsafe(32).encode(), bcrypt.gensalt()).decode()
    user = User(
        email=normalized_email,
        password=password_hash,
        email_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("facebook_auth.user_created email=%s user_id=%s", normalized_email, user.id)
    return user


def build_facebook_authorize_url(state: str) -> str:
    params = {
        "client_id": facebook_settings.facebook_client_id,
        "redirect_uri": facebook_settings.facebook_redirect_uri,
        "state": state,
        "response_type": "code",
        # Minimal scopes: email + basic profile
        "scope": "email,public_profile",
    }
    return f"{FACEBOOK_AUTH_URL}?{urllib.parse.urlencode(params)}"
