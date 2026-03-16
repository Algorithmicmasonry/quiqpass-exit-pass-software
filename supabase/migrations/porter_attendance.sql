-- ── Porter Attendance Schema ─────────────────────────────────────────────────

-- 1. Add gender to hostel table
ALTER TABLE hostel ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));

-- 2. Add gender to staff table (used to filter which hostels a porter can see)
ALTER TABLE staff ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));

-- 3. Rooms table
CREATE TABLE IF NOT EXISTS room (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id   uuid NOT NULL REFERENCES hostel(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,       -- e.g. "Room 101"
  capacity    INT,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE room ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read rooms"
  ON room FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert rooms"
  ON room FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Attendance session (one per room per day — enforced by UNIQUE constraint)
CREATE TABLE IF NOT EXISTS attendance_session (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  porter_id   uuid NOT NULL REFERENCES auth.users(id),
  hostel_id   uuid NOT NULL REFERENCES hostel(id),
  room_id     uuid NOT NULL REFERENCES room(id),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, date)
);
ALTER TABLE attendance_session ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Porters manage own sessions"
  ON attendance_session FOR ALL
  USING (auth.uid() = porter_id)
  WITH CHECK (auth.uid() = porter_id);
CREATE POLICY "Staff can read all sessions"
  ON attendance_session FOR SELECT
  USING (EXISTS (SELECT 1 FROM staff WHERE id = auth.uid()));

-- 5. Attendance entries (one per student per session)
CREATE TABLE IF NOT EXISTS attendance_entry (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid NOT NULL REFERENCES attendance_session(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES student(id),
  status      TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  on_pass     BOOLEAN NOT NULL DEFAULT false,  -- true if student had active pass
  notes       TEXT,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE attendance_entry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Porters manage entries via session"
  ON attendance_entry FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM attendance_session s
      WHERE s.id = session_id AND s.porter_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM attendance_session s
      WHERE s.id = session_id AND s.porter_id = auth.uid()
    )
  );
CREATE POLICY "Staff can read all entries"
  ON attendance_entry FOR SELECT
  USING (EXISTS (SELECT 1 FROM staff WHERE id = auth.uid()));
