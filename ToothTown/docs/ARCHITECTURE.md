# ToothTown v2 — Architecture

## Layers

- **Frontend (project root):** `index.html` (structure + views), `styles.css` (palette + layout), `app.js` (state, floor-plan SVG generation, booking, approvals).
  - The frontend is static-first so GitHub Pages can serve it with no build step.
  - Data layer: `loadData()` first tries `GET /api/appointments` (and the other `/api/*` endpoints). If any fetch fails — the normal case on Pages — it falls back to `localStorage` (`toothtown-v2`) seeded from the same data as `server/db/seed.json`.
  - Writes: in API mode, `POST /api/appointments`, `PATCH /api/appointments/:id`, `POST /api/patients`. In Pages mode, the same operations mutate the local store and re-render. Field names are identical in both modes.
- **Backend (`server/`):** Node + Express, `server/server.js`. In-memory store seeded from `server/db/seed.json`, static-serves the project root, and exposes the REST API listed in `README.md`. No external database is required to run it; `server/db/schema.sql` documents the relational shape for a future SQLite/Postgres move.
- **Floor plan:** generated in `app.js` from `ROOM_GEO`. Each room is a fill rectangle plus wall segments. A wall with a door is split into two segments with a 42px gap; a teal leaf line and a dashed swing arc are anchored at the gap edge, inside the room. No door is drawn as a free-standing frame, and no door overlaps furniture: OP interiors are text notes in the detail panel only, waiting chairs/plants/TVs are placed away from door gaps, and washrooms contain no drawn fixtures at all.
- **Basement stairs:** drawn inside the east strip as five steps whose fills darken toward the foot, ending in a labelled lower landing with a DOWN arrow. The darkest step is the landing — there is no separate dark box for steps to rise to.

## Views

Today (KPIs, plan, timelines, next up, approvals, walk-in) · Schedule (day/week grid, filters, 4-step booking) · Operatories · Patients · Staff · Approvals · Settings (accessibility, privacy, why-this-site, demo reset).

## Palette

Background #F6F8F7, surface #FFFFFF, ink #12212B, primary teal #0F766E, mint #D7EFE6, pale blue #E0F2FE, amber #B45309 (pending), red #B42318 (rejected/cancel), in-use slate #1F2A33. System/Inter-style font stack, rounded cards, generous whitespace.
