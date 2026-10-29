# Portfolio

Fakhruddin's portfolio, hosted on GitHub Pages. This is the main folder. SeatSavor and ToothTown live inside it, so one repo and one Pages site cover the portfolio and both demos.

## Live Pages

- Portfolio homepage: https://fakhrushaik.github.io/Portfolio/
- SeatSavor demo: https://fakhrushaik.github.io/Portfolio/SeatSavor/
  - This redirects to https://fakhrushaik.github.io/Portfolio/SeatSavor/public/
- ToothTown demo: https://fakhrushaik.github.io/Portfolio/ToothTown/
- Smart-AI-Planner (separate team repo, linked only): https://fakhrushaik.github.io/Smart-AI-Planner/index.html

Repo: https://github.com/fakhrushaik/Portfolio

## What is in here

```
.
├── index.html                  # Portfolio homepage
├── style.css                   # Portfolio styles, light/dark
├── script.js                   # Portfolio light/dark toggle only
├── smart-ai-planner.html       # Link-out page for the capstone, my role only
├── SeatSavor/                  # Full SeatSavor project, moved in here
│   ├── public/                 # Static demo served by Pages: index.html, style.css, app.js
│   ├── server.js               # Node.js + Express demo backend, local use only
│   ├── package.json
│   ├── README.md
│   ├── PRIVACY.md
│   ├── index.html              # Pages redirect to public/
│   └── about.html              # Portfolio case-study page
├── ToothTown/                  # Full ToothTown project, moved in here
│   ├── index.html              # Static demo served by Pages
│   ├── styles.css
│   ├── app.js
│   ├── server/                 # Backend + database schema and seed, local use only
│   ├── docs/                   # Architecture, data schema, UX cases
│   ├── README.md
│   ├── PRIVACY.md
│   ├── about.html              # Portfolio case-study page
│   └── package.json
├── .gitignore
└── README.md                   # This file
```

## How Pages works here

GitHub Pages hosts static sites only, so it serves the HTML, CSS, and JavaScript in this repo, but it does not run Node.js servers or databases.

- **SeatSavor on Pages:** the 3D room, table picking, detail cards, camera presets, zoom, themes, and accessibility mode work, because the app falls back to its built-in table data when there is no API. Demo bookings need the local server, so on Pages the booking form will say the backend is not reachable. To use bookings locally: `cd SeatSavor && npm install && npm start`, then open http://localhost:3000
- **ToothTown on Pages:** the app tries its API first, then falls back to fictional seed data saved in your own browser (localStorage). Scheduling, approvals, and reset all work in that browser-only mode. To use the backend locally, see `ToothTown/server/` and `ToothTown/docs/`.
- **Smart-AI-Planner:** not copied here. It is a team capstone repo, and this portfolio links to its live site and code. Fakhruddin's contribution is the front end: Apple-style clarity, Dark Mode, Supabase email sign-in, and calendar (.ics) import/export. Apple and Google sign-in are coming soon.

## Run it locally

No install needed for the portfolio homepage or the Pages demos. From this folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

Note: opening the SeatSavor demo from a plain static server is the same as Pages mode, demo bookings will not save. Use `npm start` in `SeatSavor/` for the booking API.

## GitHub Pages settings

This repo is set up for Pages from the `main` branch, root folder:

GitHub repo > Settings > Pages > Build and deployment > Deploy from a branch > `main` / `/ (root)`

After a push, Pages can take a minute or two to rebuild. If a page shows an old version, hard-refresh it.

## Before you share it

- [ ] Click every demo link on desktop and on a phone.
- [ ] Check SeatSavor 3D loads and tables are clickable.
- [ ] Check ToothTown loads, rooms are clickable, and a booking goes to pending approval.
- [ ] Keep demo disclaimers: fictional data only, no real bookings, patients, or payments.

## Privacy

This portfolio page has no tracking, no accounts, and no payments. SeatSavor and ToothTown demos use fictional data only.
