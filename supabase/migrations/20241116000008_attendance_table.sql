-- =====================================================
-- Migration: Attendance Table (Issue #8)
-- Version: 1.0
-- Date: 2024-11-16
-- Description: Create attendance tracking table for session check-ins
--              Missing from initial schema, required for QR check-in system
-- =====================================================

-- =====================================================
-- TABLE: attendance
-- =====================================================
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Attendance Status
  status TEXT NOT NULL DEFAULT 'PRESENT'
    CHECK (status IN ('PRESENT', 'ABSENT', 'EXCUSED', 'LATE')),

  -- Check-in Method
  check_in_method TEXT NOT NULL
    CHECK (check_in_method IN ('QR_CODE', 'MANUAL', 'GPS', 'BULK')),

  -- Check-in Details
  checked_in_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  checked_in_by UUID REFERENCES public.profiles(id), -- Professor who marked (if manual)

  -- Hours Credited
  hours_credited DECIMAL(5,2) DEFAULT 0 CHECK (hours_credited >= 0 AND hours_credited <= 24),

  -- GPS Validation (if applicable)
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  gps_accuracy DECIMAL(6, 2), -- meters

  -- Notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(session_id, enrollment_id) -- One attendance record per session per enrollment
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Query: Find attendance by session
CREATE INDEX IF NOT EXISTS idx_attendance_session
ON public.attendance(session_id);

-- Query: Find user's attendance records
CREATE INDEX IF NOT EXISTS idx_attendance_user
ON public.attendance(user_id, checked_in_at DESC);

-- Query: Find attendance by enrollment
CREATE INDEX IF NOT EXISTS idx_attendance_enrollment
ON public.attendance(enrollment_id);

-- Query: Find attendance by status
CREATE INDEX IF NOT EXISTS idx_attendance_status
ON public.attendance(status, checked_in_at DESC);

-- Query: Find attendance by check-in method
CREATE INDEX IF NOT EXISTS idx_attendance_method
ON public.attendance(check_in_method);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Students can view their own attendance
CREATE POLICY "Students can view own attendance"
ON public.attendance FOR SELECT
USING (
  auth.uid() = user_id
);

-- Professors can view attendance for their activities
CREATE POLICY "Professors can view activity attendance"
ON public.attendance FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.sessions s
    JOIN public.activities a ON s.activity_id = a.id
    WHERE s.id = attendance.session_id
      AND a.created_by = auth.uid()
  )
);

-- Professors can insert attendance for their activities
CREATE POLICY "Professors can mark attendance"
ON public.attendance FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sessions s
    JOIN public.activities a ON s.activity_id = a.id
    WHERE s.id = session_id
      AND a.created_by = auth.uid()
  )
);

-- Professors can update attendance for their activities
CREATE POLICY "Professors can update attendance"
ON public.attendance FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.sessions s
    JOIN public.activities a ON s.activity_id = a.id
    WHERE s.id = attendance.session_id
      AND a.created_by = auth.uid()
  )
);

-- Admins can view all attendance
CREATE POLICY "Admins can view all attendance"
ON public.attendance FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Admins can manage all attendance
CREATE POLICY "Admins can manage all attendance"
ON public.attendance FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- FUNCTION: Update enrollment hours and attendance rate when attendance marked
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_enrollment_on_attendance()
RETURNS TRIGGER AS $$
DECLARE
  total_hours_var DECIMAL(10,2);
  session_hours DECIMAL(5,2);
BEGIN
  -- Get hours credited from this attendance record
  session_hours := NEW.hours_credited;

  -- Calculate total hours for this enrollment (sum of all attendance hours)
  SELECT COALESCE(SUM(hours_credited), 0)
  INTO total_hours_var
  FROM public.attendance
  WHERE enrollment_id = NEW.enrollment_id
    AND status = 'PRESENT';

  -- Update enrollment with new totals
  UPDATE public.enrollments
  SET
    total_hours = total_hours_var,
    attendance_status = 'PRESENT',
    attended_at = NEW.checked_in_at,
    updated_at = NOW()
  WHERE id = NEW.enrollment_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_enrollment_on_attendance IS 'Auto-update enrollment total_hours and attendance_status when attendance is marked';

-- Trigger to update enrollment when attendance is inserted or updated
CREATE TRIGGER update_enrollment_hours
  AFTER INSERT OR UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_enrollment_on_attendance();

COMMENT ON TABLE public.attendance IS 'Session attendance tracking with multiple check-in methods (QR, manual, GPS, bulk)';

-- =====================================================
-- Migration Complete
-- =====================================================
