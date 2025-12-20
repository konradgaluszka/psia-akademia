import time
from typing import Any, Dict

import requests
from fastapi import HTTPException, status
from jose import JWTError, jwt

from app.core.config import get_settings

JWKS_CACHE_SECONDS = 3600
_jwks_cache: dict[str, Any] = {"value": None, "expires_at": 0}


def _resolve_jwks_url() -> str:
    settings = get_settings()
    if settings.clerk_jwks_url:
        return settings.clerk_jwks_url
    if settings.clerk_jwt_issuer:
        issuer = settings.clerk_jwt_issuer.rstrip("/")
        return f"{issuer}/.well-known/jwks.json"
    raise RuntimeError("CLERK_JWKS_URL or CLERK_JWT_ISSUER must be set")


def _get_jwks() -> Dict[str, Any]:
    now = time.time()
    if _jwks_cache["value"] and _jwks_cache["expires_at"] > now:
        return _jwks_cache["value"]

    url = _resolve_jwks_url()
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    jwks = response.json()
    _jwks_cache["value"] = jwks
    _jwks_cache["expires_at"] = now + JWKS_CACHE_SECONDS
    return jwks


def verify_clerk_token(token: str) -> Dict[str, Any]:
    settings = get_settings()
    jwks = _get_jwks()

    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token header"
        ) from exc

    key = next(
        (k for k in jwks.get("keys", []) if k.get("kid") == unverified_header.get("kid")),
        None,
    )
    if not key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token key"
        )

    options = {"verify_aud": bool(settings.clerk_jwt_audience), "verify_iss": bool(settings.clerk_jwt_issuer)}

    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=[key.get("alg", "RS256")],
            issuer=settings.clerk_jwt_issuer,
            audience=settings.clerk_jwt_audience,
            options=options,
        )
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc

    return payload
