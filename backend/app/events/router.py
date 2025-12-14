from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.events.events import Event, MOCK_EVENTS

events_router = APIRouter(prefix="/events", tags=["events"])


@events_router.get("", response_model=List[Event])
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


@events_router.get("/{event_id}", response_model=Event)
def get_event(event_id: str) -> Event:
    for event in MOCK_EVENTS:
        if event.id == event_id:
            return event
    raise HTTPException(status_code=404, detail="Event not found")
