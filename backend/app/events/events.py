from typing import List

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
