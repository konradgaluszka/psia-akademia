from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Event(BaseModel):
  id: str
  title: str
  description: str
  price: str
  duration: str
  location: str
  availability: List[str]
  tags: List[str]


MOCK_EVENTS: List[Event] = [
  Event(
    id="puppy-basics",
    title="Puppy Basics",
    description="Foundations for puppies: focus, recall, and household manners.",
    price="$45",
    duration="60 minutes",
    location="Outdoor yard",
    availability=["Sat 10:00", "Sun 9:00"],
    tags=["Beginner", "Group"],
  ),
  Event(
    id="agility-basics",
    title="Agility Basics",
    description="Intro to tunnels, jumps, and contact work with safety cues.",
    price="$60",
    duration="75 minutes",
    location="Arena A",
    availability=["Sat 12:00", "Sun 14:00"],
    tags=["Intermediate", "Group"],
  ),
  Event(
    id="behavior-1on1",
    title="Behavior Consult (1:1)",
    description="Personalized plan for reactivity, confidence, and focus.",
    price="$95",
    duration="60 minutes",
    location="Training room",
    availability=["Weekdays by appointment"],
    tags=["Private", "Custom"],
  ),
]


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

  @app.get("/health", tags=["system"])
  def health() -> dict[str, str]:
    return {"status": "ok"}

  @app.get("/events", response_model=List[Event], tags=["events"])
  def list_events(q: Optional[str] = Query(None, description="Search term")) -> List[Event]:
    if not q:
      return MOCK_EVENTS
    query = q.lower()
    return [
      event
      for event in MOCK_EVENTS
      if query in event.title.lower()
      or query in event.description.lower()
      or any(query in tag.lower() for tag in event.tags)
    ]

  @app.get("/events/{event_id}", response_model=Event, tags=["events"])
  def get_event(event_id: str) -> Event:
    for event in MOCK_EVENTS:
      if event.id == event_id:
        return event
    raise HTTPException(status_code=404, detail="Event not found")

  return app


app = create_app()
