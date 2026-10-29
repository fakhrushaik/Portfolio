# ToothTown v2 — Data Schema

Source of truth: `server/db/schema.sql`. The JSON seed (`server/db/seed.json`) and the frontend seed in `app.js` use the same field names.

## Tables

- **rooms:** `id, number, name, type, bookable, capacity, notes`
  - 19 numbered items (1–19). Items 15–19 (TVs, Seating, Plants, Coat Rack, Doors) are waiting-area features / the door system, stored for legend parity, with `bookable = 0`. Only OP1–OP4 are bookable.
- **staff:** `id, name, role (doctor | receptionist | it_admin), access_level (approve | schedule | full), room_id`
  - Dr John (approve), Dr Mary (approve), Anna (schedule), Shaik (full).
- **patients:** `id, name, phone, preference, notes` — demo scheduling preferences only, no health records.
- **services:** `id, name, duration_minutes, room_type`
- **appointments:** `id, patient_id, doctor_id, room_id, service_id, date (YYYY-MM-DD), start_time, end_time, status (pending | approved | rejected | cancelled | waitlist | completed), kind (scheduled | walk_in | waitlist), reject_reason, created_by_role, created_at`
- **approvals:** `id, appointment_id, decided_by, decision, reason, decided_at`

## Rules enforced in both layers

- **Conflict:** same doctor OR same room, same date, overlapping time, ignoring cancelled / rejected / waitlist rows, is a 409 / blocked submit. Overlap: `new_start < existing_end AND new_end > existing_start`.
- **Approval:** new bookings are `pending` until a doctor or IT Admin approves/rejects. Rejection requires a reason.
- **Slots:** 09:00–16:30 in 30-minute starts, computed from active bookings; a slot is free only if neither its doctor nor its room is taken at that start.
- **Demo roles:** role checks are demo-only (`x-demo-role` header / UI role switcher), not real authentication.

## Seed counts

19 numbered room/feature rows, 4 staff, 6 demo patients, 3 demo appointments (frontend seed uses the current day so Today is never empty in a fresh demo; SQL seed uses 2026-10-29 as the example day).
