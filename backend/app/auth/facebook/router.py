import urllib.parse
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException
from fastapi import Response, Request
from fastapi.responses import RedirectResponse

from app.auth.facebook.facebook import facebook_settings
from app.auth.utils import generate_state

auth_router = APIRouter(prefix="/facebook/auth", tags=["auth"])

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
        secure=True,
        samesite="lax",
    )
    return response


@auth_router.get("/facebook/auth/callback")
async def facebook_callback(request: Request):
    # 1. Get query params
    code = request.query_params.get("code")
    state = request.query_params.get("state")
    if not code or not state:
        raise HTTPException(status_code=400, detail="Missing code or state")

    # 2. Validate state
    cookie_state = request.cookies.get("fb_oauth_state")
    if not cookie_state or cookie_state != state:
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
        raise HTTPException(
            status_code=400,
            detail=f"Error exchanging code: {token_resp.text}",
        )
    token_data = token_resp.json()
    access_token = token_data.get("access_token")
    if not access_token:
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
        raise HTTPException(
            status_code=400,
            detail=f"Error fetching user profile: {me_resp.text}",
        )

    me = me_resp.json()
    fb_id = me.get("id")
    email = me.get("email")
    name = me.get("name")

    if not fb_id:
        raise HTTPException(status_code=400, detail="No Facebook ID in profile")

    # 5. Find or create local user
    user = await find_or_create_user_from_facebook(fb_id, email, name)

    # 6. Create your own session (cookie or JWT)
    session_cookie = create_session_for_user(user.id)

    # 7. Redirect back to frontend with session established
    redirect = RedirectResponse(url="http://localhost:3000/app")  # or your dashboard
    redirect.set_cookie(
        key="session",
        value=session_cookie,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    return redirect


async def find_or_create_user_from_facebook(fb_id: str, email: Optional[str], name: Optional[str]):
    """
    Pseudocode. Implement using your DB (SQLAlchemy, Tortoise, etc.)
    """
    # 1. Try to find user by facebook_id
    user = await db.users.find_one({"facebook_id": fb_id})
    if user:
        return user

    # 2. Optionally, if email present, link to existing user with same email
    if email:
        user = await db.users.find_one({"email": email})
        if user:
            # Update facebook_id field
            user.facebook_id = fb_id
            await db.users.save(user)
            return user

    # 3. Create new user
    user = await db.users.create(
        email=email,
        name=name,
        facebook_id=fb_id,
    )
    return user


def create_session_for_user(user_id: str) -> str:
    """
    Pseudocode: you can use:
      - a random session_id stored in DB/Redis, or
      - a signed JWT.
    """
    import secrets
    session_id = secrets.token_urlsafe(32)
    # store mapping: session_id -> user_id in DB/Redis with expiry
    # db.sessions.insert({ session_id, user_id, ... })
    return session_id


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