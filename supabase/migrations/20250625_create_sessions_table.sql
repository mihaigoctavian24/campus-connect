-- Create sessions table for activity scheduling
CREATE TABLE IF NOT EXISTS public.sessions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Session Details
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,

  -- Status & Capacity
  status VARCHAR(20) DEFAULT 'SCHEDULED'
    CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  max_participants INTEGER,

  -- QR Code & Location Verification (for Week 11-12)
  qr_code_data TEXT, -- Encrypted QR payload
  location_hash TEXT, -- For GPS validation

  -- Notifications
  reminder_sent BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for Performance
CREATE INDEX idx_sessions_activity ON public.sessions(activity_id)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_sessions_date ON public.sessions(date)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_sessions_status ON public.sessions(status)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_sessions_activity_date ON public.sessions(activity_id, date)
  WHERE deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Students can view sessions for activities they're enrolled in or that are open
CREATE POLICY "Students can view sessions for their enrollments or open activities"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.id = sessions.activity_id
        AND a.deleted_at IS NULL
        AND (
          a.status = 'OPEN'
          OR EXISTS (
            SELECT 1 FROM public.enrollments e
            WHERE e.activity_id = a.id
              AND e.student_id = auth.uid()
              AND e.status = 'ACCEPTED'
          )
        )
    )
  );

-- Professors can view sessions for activities they created
CREATE POLICY "Professors can view their activity sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities a
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE a.id = sessions.activity_id
        AND a.created_by = auth.uid()
        AND p.role = 'PROFESSOR'
        AND a.deleted_at IS NULL
    )
  );

-- Professors can create sessions for their activities
CREATE POLICY "Professors can create sessions for their activities"
  ON public.sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.activities a
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE a.id = sessions.activity_id
        AND a.created_by = auth.uid()
        AND p.role = 'PROFESSOR'
        AND a.deleted_at IS NULL
    )
  );

-- Professors can update sessions for their activities
CREATE POLICY "Professors can update their activity sessions"
  ON public.sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.activities a
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE a.id = sessions.activity_id
        AND a.created_by = auth.uid()
        AND p.role = 'PROFESSOR'
        AND a.deleted_at IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.activities a
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE a.id = sessions.activity_id
        AND a.created_by = auth.uid()
        AND p.role = 'PROFESSOR'
        AND a.deleted_at IS NULL
    )
  );

-- Professors can soft-delete sessions for their activities
CREATE POLICY "Professors can delete their activity sessions"
  ON public.sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.activities a
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE a.id = sessions.activity_id
        AND a.created_by = auth.uid()
        AND p.role = 'PROFESSOR'
        AND a.deleted_at IS NULL
    )
  );

-- Admins can view all sessions
CREATE POLICY "Admins can view all sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Admins can manage all sessions
CREATE POLICY "Admins can manage all sessions"
  ON public.sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_sessions_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.sessions IS 'Scheduled sessions for activities - supports recurring meetings and QR code check-in';
COMMENT ON COLUMN public.sessions.qr_code_data IS 'Encrypted QR code payload for attendance check-in (Week 11-12)';
COMMENT ON COLUMN public.sessions.location_hash IS 'Hashed GPS coordinates for location verification (Week 11-12)';
COMMENT ON COLUMN public.sessions.reminder_sent IS 'Flag to track if reminder notification was sent (Week 15-16)';
