from fastapi import APIRouter

from app.auth.router import auth_router
from app.events.router import events_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(events_router)

__all__ = ["api_router"]
