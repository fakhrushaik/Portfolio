/**
 * SeatSavor — demo backend (no database, no payments, no accounts).
 *
 * Serves the static frontend in ./public and a small JSON API.
 * Bookings are kept in memory only and are lost when the server restarts.
 * See PRIVACY.md for the full demo-data rules.
 */
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "64kb" }));
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Demo data — edit this array to change the floor.
// Keep the same shape in public/app.js FALLBACK_TABLES if you also open
// index.html directly from the file system (no server).
// ---------------------------------------------------------------------------
const TABLES = [
  { id: "T1", seats: 2, shape: "Round", dimensions: "0.90 m diameter", status: "free", zone: "Window", note: "Quiet window spot for two, good morning light.", x: -5.5, z: -3.5 },
  { id: "T2", seats: 4, shape: "Rectangle", dimensions: "1.20 m × 0.80 m", status: "free", zone: "Window", note: "Window row, easy to watch the street.", x: -2.5, z: -3.5 },
  { id: "T3", seats: 6, shape: "Rectangle", dimensions: "2.00 m × 1.00 m", status: "occupied", zone: "Window", note: "Large window table, currently in use.", x: 0.5, z: -3.5 },
  { id: "T4", seats: 4, shape: "Square", dimensions: "1.00 m × 1.00 m", status: "free", zone: "Centre", note: "Central, easy to reach from the entrance.", x: 3.5, z: -3.5 },
  { id: "T5", seats: 2, shape: "Round", dimensions: "0.90 m diameter", status: "occupied", zone: "Centre", note: "Cosy centre table for two.", x: 6.0, z: -3.0 },
  { id: "T6", seats: 4, shape: "Rectangle", dimensions: "1.40 m × 0.85 m", status: "free", zone: "Centre", note: "Near the plants, a little quieter.", x: -5.5, z: 0.0 },
  { id: "T7", seats: 4, shape: "Rectangle", dimensions: "1.40 m × 0.85 m", status: "free", zone: "Centre", note: "Open centre table, good for groups of four.", x: -2.0, z: 0.0 },
  { id: "T8", seats: 8, shape: "Rectangle", dimensions: "2.40 m × 1.00 m", status: "free", zone: "Centre", note: "Long table for celebrations and big groups.", x: 2.0, z: 0.0 },
  { id: "T9", seats: 2, shape: "Round", dimensions: "0.90 m diameter", status: "occupied", zone: "Bar", note: "Close to the bar, lively in the evening.", x: 6.0, z: 0.5 },
  { id: "T10", seats: 4, shape: "Square", dimensions: "1.00 m × 1.00 m", status: "free", zone: "Garden", note: "Near the garden side, plants all around.", x: -5.5, z: 3.5 },
  { id: "T11", seats: 6, shape: "Rectangle", dimensions: "2.00 m × 1.00 m", status: "occupied", zone: "Garden", note: "Garden-side table for six, currently in use.", x: -1.5, z: 3.5 },
  { id: "T12", seats: 4, shape: "Rectangle", dimensions: "1.20 m × 0.80 m", status: "free", zone: "Bar", note: "Bar corner, easy to order and chat.", x: 3.5, z: 3.5 },
];

const bookings = [];
let nextBookingId = 1;

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "seatsavor", tables: TABLES.length, bookings: bookings.length });
});

app.get("/api/tables", (req, res) => {
  res.json(TABLES);
});

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { date, time, party, tableId, name } = req.body || {};
  const errors = [];

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("date must be YYYY-MM-DD");
  if (!time || !/^\d{2}:\d{2}$/.test(time)) errors.push("time must be HH:MM");
  const partySize = Number(party);
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 12) {
    errors.push("party must be a whole number from 1 to 12");
  }
  const table = TABLES.find((t) => t.id === tableId);
  if (!table) errors.push("tableId must be one of the 12 tables (T1–T12)");
  if (table && Number.isInteger(partySize) && partySize > table.seats) {
    errors.push(`${table.id} seats ${table.seats}, so party size ${partySize} is too large for it`);
  }
  if (table && table.status === "occupied") {
    errors.push(`${table.id} is currently occupied in the demo data`);
  }
  if (errors.length > 0) return res.status(400).json({ ok: false, errors });

  const booking = {
    id: nextBookingId++,
    tableId: table.id,
    date,
    time,
    party: partySize,
    // Optional, demo only. Never a real name / payment / contact record.
    name: typeof name === "string" && name.trim() ? name.trim().slice(0, 60) : "Demo guest",
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return res.status(201).json({ ok: true, booking });
});

// Demo-only reset: clears in-memory bookings. Restarting the server does the same.
app.post("/api/bookings/reset", (req, res) => {
  bookings.length = 0;
  nextBookingId = 1;
  res.json({ ok: true, bookings: [] });
});

app.listen(PORT, () => {
  console.log(`SeatSavor running at http://localhost:${PORT}`);
  console.log("Frontend: http://localhost:3000  |  Portfolio: http://localhost:3000/portfolio.html");
});
