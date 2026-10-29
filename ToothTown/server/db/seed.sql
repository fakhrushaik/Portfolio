-- ToothTown v2 — seed data. Fictional demo data only.
-- 19 numbered items from the user's PDF plan (1-19).
-- Items 15-19 are waiting-area features and the door system, stored for
-- legend parity; they are NOT bookable rooms. Bookable rooms are OP1-OP4.
-- Dates in the demo appointments use 2026-10-29 as the example day;
-- the frontend seed generates appointments for the current day at runtime
-- so the Today view is never empty in a fresh demo.

INSERT INTO rooms (id, number, name, type, bookable, capacity, notes) VALUES
('op1', 1, 'OP1 — Children & Heavy Dental', 'operatory', 1, 1, 'Doc chair, patient chair, wash basin — see room detail panel only.'),
('op2', 2, 'OP2', 'operatory', 1, 1, 'Doc chair, patient chair, wash basin — see room detail panel only.'),
('op3', 3, 'OP3', 'operatory', 1, 1, 'Doc chair, patient chair, wash basin — see room detail panel only.'),
('op4', 4, 'OP4', 'operatory', 1, 1, 'Doc chair, patient chair, wash basin — see room detail panel only.'),
('storage', 5, 'Storage', 'support', 0, 0, 'Supplies storage. Not bookable.'),
('xray', 6, 'X-Ray', 'support', 0, 0, 'Thicker walls for protection. Not a bookable operatory.'),
('doc1', 7, 'Doctor Office 1', 'office', 0, 0, 'Doctor office. Not bookable.'),
('doc2', 8, 'Doctor Office 2', 'office', 0, 0, 'Doctor office. Not bookable.'),
('it', 9, 'IT Office', 'office', 0, 0, 'IT Admin base. Not bookable.'),
('reception', 10, 'Reception', 'support', 0, 0, 'Reception with printers and scanners.'),
('snacks', 11, 'Snacks & Information / Brochure', 'support', 0, 0, 'Counter in the waiting zone.'),
('play', 12, 'Child Play Area', 'waiting', 0, 0, 'Waiting-zone play area.'),
('wash1', 13, 'Washroom 1', 'utility', 0, 0, 'Closed labelled room only. No fixtures shown in the plan.'),
('wash2', 14, 'Washroom 2', 'utility', 0, 0, 'Closed labelled room only. No fixtures shown in the plan.'),
('tvs', 15, 'TVs x2', 'feature', 0, 0, 'Wall-mounted screens in Waiting, on walls only.'),
('seating', 16, 'Seating', 'feature', 0, 0, 'Individual chairs in Waiting. No continuous bar.'),
('plants', 17, 'Plants', 'feature', 0, 0, 'Small potted plants in Waiting and lobby.'),
('coat', 18, 'Coat Rack', 'feature', 0, 0, 'Coat rack in the southeast lobby.'),
('doors', 19, 'Doors', 'feature', 0, 0, 'Door system: a gap in a wall plus a leaf and swing arc, anchored in that wall.');

INSERT INTO staff (id, name, role, access_level, room_id) VALUES
('dr-john', 'Dr John', 'doctor', 'approve', 'doc1'),
('dr-mary', 'Dr Mary', 'doctor', 'approve', 'doc2'),
('anna', 'Anna', 'receptionist', 'schedule', 'reception'),
('shaik', 'Shaik', 'it_admin', 'full', 'it');

INSERT INTO patients (id, name, phone, preference, notes) VALUES
('p1', 'Ava Brooks', '555-0101', 'Morning', 'Demo patient. Prefers mornings.'),
('p2', 'Mia Chen', '555-0102', 'Kids room', 'Demo patient. Prefers a kids-friendly operatory.'),
('p3', 'Liam Patel', '555-0103', 'Any doctor', 'Demo patient.'),
('p4', 'Noah Kim', '555-0104', 'Afternoon', 'Demo patient. Prefers afternoons.'),
('p5', 'Emma Wilson', '555-0105', 'Dr Mary', 'Demo patient. Prefers Dr Mary.'),
('p6', 'Oliver Reed', '555-0106', 'Any doctor', 'Demo patient.');

INSERT INTO services (id, name, duration_minutes, room_type) VALUES
('checkup', 'Checkup', 30, 'operatory'),
('cleaning', 'Cleaning', 45, 'operatory'),
('filling', 'Filling', 45, 'operatory'),
('root-canal', 'Root Canal', 60, 'operatory'),
('kids-checkup', 'Kids Checkup', 30, 'operatory'),
('xray-check', 'X-Ray Check', 30, 'operatory');

-- 3 demo appointments, all approved, on the example day.
INSERT INTO appointments (id, patient_id, doctor_id, room_id, service_id, date, start_time, end_time, status, kind, created_by_role) VALUES
('a1', 'p1', 'dr-john', 'op1', 'checkup', '2026-10-29', '09:00', '09:30', 'approved', 'scheduled', 'receptionist'),
('a2', 'p2', 'dr-john', 'op4', 'kids-checkup', '2026-10-29', '10:00', '10:30', 'approved', 'scheduled', 'receptionist'),
('a3', 'p5', 'dr-mary', 'op2', 'cleaning', '2026-10-29', '11:00', '11:45', 'approved', 'scheduled', 'receptionist');
