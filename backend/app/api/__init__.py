from fastapi import APIRouter

from app.auth.router import auth_router
from app.events.router import events_router
from app.auth.facebook.router import auth_router as facebook_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(events_router)
api_router.include_router(facebook_router)

__all__ = ["api_router"]
