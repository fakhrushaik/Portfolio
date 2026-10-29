// ToothTown v2 — backend API (Node + Express, no external database required)
// Fictional demo data only. No real patient health data, no payments,
// no accounts, no real authentication.
// Role checks below are DEMO ONLY: they read the x-demo-role header /
// body field so the UI can show the approval workflow. They are NOT real
// auth and must not be used for real clinic operations.
// Run: npm install && npm start   (serves the frontend at / and /api)

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const seedPath = path.join(__dirname, 'db', 'seed.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

// In-memory store, seeded from seed.json (same field names as the
// frontend localStorage store and as schema.sql).
let rooms = [...seed.rooms];
let staff = [...seed.staff];
let patients = [...seed.patients];
let services = [...seed.services];
let appointments = [...seed.appointments];
let approvals = [];

function toMinutes(t) {
  const [h, m] = String(t).split(':').map(Number);
  return h * 60 + m;
}
function overlaps(aStart, aEnd, bStart, bEnd) {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(aEnd) > toMinutes(bStart);
}
// Conflict rule: same doctor OR same room, same date, overlapping time,
// ignoring cancelled / rejected / waitlist rows.
function findConflict(candidate, ignoreId) {
  return appointments.find((a) => {
    if (a.id === ignoreId) return false;
    if (a.date !== candidate.date) return false;
    if (['cancelled', 'rejected', 'waitlist'].includes(a.status)) return false;
    if (a.doctor_id !== candidate.doctor_id && a.room_id !== candidate.room_id) return false;
    return overlaps(candidate.start_time, candidate.end_time, a.start_time, a.end_time);
  });
}
function slotTimes(date) {
  // 09:00-16:30, 30-minute slots. Slots are computed, not stored.
  const out = [];
  for (let m = 9 * 60; m <= 16 * 60 + 30; m += 30) {
    const h = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    out.push(`${h}:${mm}`);
  }
  return out;
}
function demoRole(req) {
  return req.headers['x-demo-role'] || req.body.role || 'receptionist';
}

app.get('/api/rooms', (req, res) => res.json(rooms));
app.get('/api/staff', (req, res) => res.json(staff));
app.get('/api/patients', (req, res) => res.json(patients));
app.get('/api/services', (req, res) => res.json(services));
app.get('/api/appointments', (req, res) => {
  let list = [...appointments];
  if (req.query.date) list = list.filter((a) => a.date === req.query.date);
  if (req.query.doctor) list = list.filter((a) => a.doctor_id === req.query.doctor);
  if (req.query.room) list = list.filter((a) => a.room_id === req.query.room);
  if (req.query.status) list = list.filter((a) => a.status === req.query.status);
  res.json(list);
});
app.get('/api/approvals', (req, res) => {
  res.json(appointments.filter((a) => a.status === 'pending'));
});
app.get('/api/slots', (req, res) => {
  const { date, doctor, room } = req.query;
  if (!date) return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
  const taken = new Set();
  appointments.forEach((a) => {
    if (a.date !== date) return;
    if (['cancelled', 'rejected', 'waitlist'].includes(a.status)) return;
    if (doctor && a.doctor_id === doctor) taken.add(a.start_time);
    if (room && a.room_id === room) taken.add(a.start_time);
  });
  res.json(slotTimes(date).map((t) => ({ time: t, free: !taken.has(t) })));
});

app.post('/api/patients', (req, res) => {
  const { name, phone, preference } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const p = { id: `p${Date.now()}`, name, phone: phone || '', preference: preference || '', notes: 'Demo patient.' };
  patients.push(p);
  res.status(201).json(p);
});

app.post('/api/appointments', (req, res) => {
  const b = req.body || {};
  const required = ['patient_id', 'doctor_id', 'room_id', 'service_id', 'date', 'start_time', 'end_time'];
  for (const f of required) if (!b[f]) return res.status(400).json({ error: `${f} is required` });
  const room = rooms.find((r) => r.id === b.room_id);
  if (!room || !room.bookable) return res.status(400).json({ error: 'room is not bookable' });
  const conflict = findConflict(b);
  if (conflict) {
    return res.status(409).json({
      error: 'Double booking: that doctor or room is already booked at that time.',
      conflict_id: conflict.id,
      conflict_with: conflict,
    });
  }
  // New bookings are PENDING until a doctor approves them, except a
  // waitlist entry which is stored with status waitlist.
  const appt = {
    id: `a${Date.now()}`,
    patient_id: b.patient_id,
    doctor_id: b.doctor_id,
    room_id: b.room_id,
    service_id: b.service_id,
    date: b.date,
    start_time: b.start_time,
    end_time: b.end_time,
    status: b.kind === 'waitlist' ? 'waitlist' : 'pending',
    kind: b.kind || 'scheduled',
    reject_reason: '',
    created_by_role: demoRole(req),
  };
  appointments.push(appt);
  res.status(201).json(appt);
});

app.patch('/api/appointments/:id', (req, res) => {
  const appt = appointments.find((a) => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: 'appointment not found' });
  const { status, reject_reason, date, start_time, end_time, room_id, doctor_id } = req.body || {};
  const role = demoRole(req);
  // DEMO role check only: approve / reject should come from a doctor
  // or IT Admin. Receptionist may cancel or reschedule.
  if ((status === 'approved' || status === 'rejected') && !['doctor', 'it_admin'].includes(role)) {
    return res.status(403).json({ error: 'Demo role check: only a doctor or IT Admin can approve or reject.' });
  }
  if (date || start_time || end_time || room_id || doctor_id) {
    const candidate = {
      ...appt,
      date: date || appt.date,
      start_time: start_time || appt.start_time,
      end_time: end_time || appt.end_time,
      room_id: room_id || appt.room_id,
      doctor_id: doctor_id || appt.doctor_id,
    };
    const conflict = findConflict(candidate, appt.id);
    if (conflict && status !== 'cancelled' && status !== 'rejected') {
      return res.status(409).json({ error: 'Reschedule conflicts with an existing booking.', conflict_id: conflict.id });
    }
    Object.assign(appt, candidate);
  }
  if (status) {
    appt.status = status;
    if (status === 'rejected') appt.reject_reason = reject_reason || '';
    if (status === 'approved' || status === 'rejected') {
      approvals.push({
        id: `ap${Date.now()}`,
        appointment_id: appt.id,
        decided_by: role,
        decision: status,
        reason: reject_reason || '',
        decided_at: new Date().toISOString(),
      });
    }
  }
  res.json(appt);
});

// Serve the static frontend (project root) when run locally.
app.use(express.static(path.join(__dirname, '..')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`ToothTown v2 on http://localhost:${PORT}`));
}
module.exports = app;
