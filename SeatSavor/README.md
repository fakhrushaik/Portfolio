# SeatSavor

**SeatSavor** — pick your table in 3D, like booking a seat on a plane.

A showcase-first portfolio project: a pastel isometric restaurant floor with 12 clickable tables, smooth camera moves, light/dark mode, and an accessibility mode — plus a small demo-only backend. Inspired by a 3D table-booking demo shared on Threads, rebuilt as a real, runnable VS Code project.

> Demo only. No payments, no accounts, no real reservations. See [Privacy](#privacy).

## Run it

```bash
cd seatsavor
npm install
npm start
```

Then open:

- App: <http://localhost:3000>
- Portfolio starter: <http://localhost:3000/portfolio.html>

Stop the server with `Ctrl+C`.

### Open in VS Code

```bash
code .
```

Or open the `seatsavor` folder from VS Code's File menu. Recommended extensions will be suggested automatically (see `.vscode/extensions.json`). Press `F5` to launch the server with the debugger, or use the "Launch Chrome" configuration to open the app.

## What is in v1

- 12 tables (T1–T12) in one pastel isometric room: window wall, bar counter, plants, pendant lamps
- Table states: **free (blue)**, **occupied (coral)**, **selected (solid + glow)**
- Click a table in 3D, or pick it from the sidebar list, to open a detail card: name, seats, shape, dimensions, zone, location note, and a 2D top-down footprint
- Smooth, damped orbit camera: drag to rotate, scroll/pinch to zoom, right-drag to pan
- **Gentle zoom (fixed from v1 feedback):** low default zoom speed (0.35), a zoom-speed slider (0.10–1.00), and `+` / `−` zoom buttons
- Camera presets: Poster (wide opening view), Top down, Window side, Bar corner, plus auto-rotate
- **Light/dark mode** toggle, persisted in your browser only
- **Accessibility mode** toggle: larger text, high contrast, reduced motion (camera presets snap instead of animating), visible focus outlines, keyboard navigation — Tab to the table list, arrow keys to move, Enter to select; arrow keys on the 3D canvas cycle tables
- Sidebar: OPEN/CLOSED toggle (visual only in v1), All / Free / Occupied filters, Menus / Bookings / Settings as "Soon" placeholders, Edit Layout as a v1.1 placeholder (no drag editing yet)

## Project structure

```
seatsavor/
├── package.json          # seatsavor, Express dependency, npm start
├── server.js             # Express server + in-memory demo API + table data
├── public/
│   ├── index.html        # SeatSavor app page
│   ├── style.css         # Light/dark + accessibility styles, mobile layout
│   ├── app.js            # Three.js scene, selection, presets, zoom, themes
│   └── portfolio.html    # Portfolio starter — SeatSavor as Project #1
├── PRIVACY.md            # Full privacy rules
├── README.md             # This file
└── .vscode/
    ├── settings.json
    ├── launch.json
    └── extensions.json
```

## API docs (demo only, in-memory)

Base URL when running locally: `http://localhost:3000`

| Method | Path | What it does |
|---|---|---|
| GET | `/api/health` | `{ status: "ok", app: "seatsavor", tables: 12, bookings: n }` |
| GET | `/api/tables` | The 12 tables: id, seats, shape, dimensions, status, zone, note, x, z |
| GET | `/api/bookings` | Demo bookings stored in memory (empty on restart) |
| POST | `/api/bookings` | Create a demo booking. Body: `{ tableId, date: "YYYY-MM-DD", time: "HH:MM", party: 1–12, name? }`. Returns 400 with `errors` if the date/time/party/table is invalid, the party is larger than the table's seats, or the table is occupied in demo data. Returns 201 with the booking on success. |
| POST | `/api/bookings/reset` | Clear all demo bookings |

Example:

```bash
curl http://localhost:3000/api/tables
curl -X POST http://localhost:3000/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{"tableId":"T7","date":"2026-11-01","time":"19:00","party":4}'
```

## How to change table data

Edit the `TABLES` array in `server.js` — that is the source of truth when the app runs from the server. Each table needs: `id`, `seats`, `shape` (`Round`, `Square`, or `Rectangle`), `dimensions` (text, e.g. `"1.40 m × 0.85 m"`), `status` (`"free"` or `"occupied"`), `zone`, `note`, and `x` / `z` position on the floor (roughly −8 to +8 for x, −5 to +5 for z).

If you also open `public/index.html` directly from the file system (no server), update the matching `FALLBACK_TABLES` array at the top of `public/app.js` too — the app uses the API when it can, and the fallback only when the API is unreachable.

## Privacy

Demo data only. No tracking, no advertising cookies, no payments, no accounts. Bookings are in-memory demo records only — they are not shared or sold, and they vanish on restart or when you click "Clear demo bookings". Theme / accessibility / zoom preferences live only in your browser's `localStorage`. Full rules: [`PRIVACY.md`](PRIVACY.md).

## Name ideas considered

The chosen name is **SeatSavor**. Other fun, unique ideas from the same brainstorm, in case you ever rename or spin off a variant: TableTrek, SavorSeat, Plate & Place, The Golden Table, BookMyBooth, Chairish, NoshNook, TableTrail, SeatStory, FeastFinder.

## Next steps (not in v1)

- Drag-to-edit layout (the "Edit Layout" button is a placeholder)
- Real booking flow with date/time/party filtering before picking a table
- A second room / restaurant switcher
- A recorded poster-frame demo video of the app in action
