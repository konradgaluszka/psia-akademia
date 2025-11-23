## 1. Goals

- Provide a **consumer-facing homepage** for discovering and booking events:  courses or meetings in my dog academy.
- Use a **modern, clean layout** similar in structure and “feel” to booksy.com, but with original branding.
- Implement as:
  - **React** SPA (Next.js) for the frontend.
  - **Python backend** (FastAPI) for search and booking APIs.

---

## 2. Tech Stack

### Frontend

- **Framework:** React (Next.js)
- **Styling:** Tailwind CSS (preferred)
- **Routing:**
  - `/` – Home (this page)
  - `/search` – Search results page
  - `/event/:id` – Business details page (not fully specified here, but considered in layout)

### Backend

- **Language:** Python
- **Framework:** FastAPI (preferred) or Flask
- **API style:** JSON REST
- **CORS:** Enabled for the frontend origin



## 3. Layout
On top of the navbar there's a navbar: logo on the left, login on the right.
At the bottom of the navbar there's a menu including. "Events", "About us", "Contact"
Navbar has a background image.

