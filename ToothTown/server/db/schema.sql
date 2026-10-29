-- ToothTown v2 — database schema
-- Fictional demo data only. No real patient health data.
-- This schema is shared by the Node API (server/server.js) and the
-- static GitHub Pages frontend (index.html / app.js, via localStorage).
-- Field names are identical in both layers.

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- operatory, office, support, waiting, utility, feature
  bookable INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 1,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- doctor, receptionist, it_admin
  access_level TEXT NOT NULL, -- full, approve, schedule
  room_id TEXT REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  preference TEXT, -- e.g. morning, any doctor, kids room; demo scheduling preference only
  notes TEXT
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  room_type TEXT NOT NULL DEFAULT 'operatory'
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id),
  doctor_id TEXT NOT NULL REFERENCES staff(id),
  room_id TEXT NOT NULL REFERENCES rooms(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  date TEXT NOT NULL, -- YYYY-MM-DD
  start_time TEXT NOT NULL, -- HH:MM, 24h
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, cancelled, waitlist, completed
  kind TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, walk_in, waitlist
  reject_reason TEXT,
  created_by_role TEXT NOT NULL DEFAULT 'receptionist',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  appointment_id TEXT NOT NULL REFERENCES appointments(id),
  decided_by TEXT NOT NULL REFERENCES staff(id),
  decision TEXT NOT NULL, -- approved, rejected
  reason TEXT,
  decided_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Conflict rule, enforced in code (server.js and app.js, same logic):
-- An appointment may not overlap another non-cancelled, non-rejected
-- appointment for the SAME doctor OR the SAME room on the SAME date.
-- Overlap test: new_start < existing_end AND new_end > existing_start.
-- Index to support the date + doctor / date + room lookups:
CREATE INDEX IF NOT EXISTS idx_appt_date_doctor ON appointments(date, doctor_id);
CREATE INDEX IF NOT EXISTS idx_appt_date_room ON appointments(date, room_id);
CREATE INDEX IF NOT EXISTS idx_appt_status ON appointments(status);
