# ToothTown v2

A professional, calm operations demo for a small dentistry clinic — not a game view.

**What it is:** a 2D top-down floor plan (numbered 1–19 from the clinic plan), a Today view with KPIs and per-operatory timelines, a Schedule view with a 4-step booking flow, an approvals queue, patients, staff, and settings. Rooms in use go dark slate; available rooms stay light, in both light and dark themes.

**Fictional demo data only.** No real patient health data, no payments, no accounts, no certification claims. See `PRIVACY.md`.

## Run locally (with backend)

```bash
npm install
npm start
# open http://localhost:3000
```

The API is at `/api/rooms`, `/api/staff`, `/api/patients`, `/api/appointments?date=`, `/api/slots?doctor=&room=&date=`, `/api/approvals`, `POST /api/appointments`, `PATCH /api/appointments/:id`, `POST /api/patients`. The server serves the frontend from the project root, so the same files work both ways.

## Run on GitHub Pages (static, no backend required)

GitHub Pages serves the project root: `index.html`, `styles.css`, and `app.js`. On Pages there is no `/api`, so the frontend automatically falls back to `localStorage` with the exact same field names as the API (`rooms`, `staff`, `patients`, `services`, `appointments`). Booking, conflict checks, approvals, cancel, reschedule, waitlist, and demo reset all work in the browser. Demo changes on Pages stay in that visitor's own browser only.

To publish: push this folder's contents to a repository's Pages branch/root (the parent agent handles the transfer — this workspace copy is not pushed by this build), enable Pages for that branch, and open the Pages URL. No build step is needed.

## Workflow

1. A doctor books an operatory, or a receptionist schedules a patient by availability and preference.
2. Every new booking is **pending** until a doctor approves or rejects it (rejection needs a reason).
3. IT Admin (Shaik) has full access in this demo. Role checks in the API are demo-only, not real authentication.

## Layout (1–19)

1 OP1 Children & Heavy Dental · 2 OP2 · 3 OP3 · 4 OP4 · 5 Storage · 6 X-Ray (thicker walls) · 7 Doctor Office 1 · 8 Doctor Office 2 · 9 IT Office · 10 Reception (printers & scanners) · 11 Snacks & Information / Brochure · 12 Child Play Area · 13 Washroom 1 · 14 Washroom 2 · 15 TVs ×2 · 16 Seating (individual chairs) · 17 Plants · 18 Coat Rack (southeast lobby) · 19 Doors (gap + leaf + swing arc, anchored in the wall).

Washrooms are closed labelled rooms only. Basement stairs descend to a labelled lower landing. Waiting has individual chairs, small potted plants, and wall-mounted TVs — no continuous bar.

## Docs

- `docs/ARCHITECTURE.md` — layers, API-first with localStorage fallback
- `docs/DATA_SCHEMA.md` — tables, fields, conflict rule
- `docs/UX_CASES.md` — empty day, no slot, double booking, pending, walk-in, cancel, reschedule, waitlist, no search results, mobile
- `PRIVACY.md` — demo-data wording
