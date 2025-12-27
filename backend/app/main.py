from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api import api_router
from app.core.database import Base, engine, get_db
from app.models import user as user_model  # noqa: F401
import logging

logging.basicConfig(level=logging.INFO)

def create_app() -> FastAPI:
  app = FastAPI(title="Dog Academy API", version="0.1.0")

  app.add_middleware(
    CORSMiddleware,
    allow_origins=[
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  @app.on_event("startup")
  def on_startup() -> None:
    Base.metadata.create_all(bind=engine)

  @app.get("/health", tags=["system"])
  def health() -> dict[str, str]:
    return {"status": "ok"}

  app.include_router(api_router)

  return app


app = create_app()
