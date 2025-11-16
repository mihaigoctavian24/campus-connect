-- =====================================================
-- Migration: Missing Functions from Issue #16
-- Version: 1.1
-- Date: 2024-11-16
-- Description: Add missing functions required by Issue #16
--              - QR code generation and validation
--              - Attendance rate calculation
--              - Audit log helper
-- =====================================================

-- =====================================================
-- FUNCTION: Generate QR code data for session
-- =====================================================
CREATE OR REPLACE FUNCTION public.generate_qr_code_data(p_session_id UUID)
RETURNS TEXT AS $$
DECLARE
  qr_payload TEXT;
  qr_secret TEXT;
  qr_timestamp BIGINT;
BEGIN
  -- Get current timestamp in milliseconds
  qr_timestamp := EXTRACT(EPOCH FROM NOW())::BIGINT * 1000;

  -- Generate secret from session_id + timestamp + random salt
  qr_secret := ENCODE(
    DIGEST(
      p_session_id::TEXT || qr_timestamp::TEXT || RANDOM()::TEXT,
      'sha256'
    ),
    'hex'
  );

  -- Create JSON payload: {session_id, timestamp, secret}
  qr_payload := JSON_BUILD_OBJECT(
    'session_id', p_session_id,
    'timestamp', qr_timestamp,
    'secret', qr_secret
  )::TEXT;

  -- Update session with QR data and expiry (30 minutes from now)
  UPDATE public.sessions
  SET
    qr_code_data = qr_secret,
    qr_expires_at = NOW() + INTERVAL '30 minutes',
    updated_at = NOW()
  WHERE id = p_session_id;

  RETURN qr_payload;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.generate_qr_code_data IS 'Generate QR code payload for session attendance validation. Returns JSON with session_id, timestamp, and secret. QR expires after 30 minutes.';

-- =====================================================
-- FUNCTION: Validate QR code for session attendance
-- =====================================================
CREATE OR REPLACE FUNCTION public.validate_qr_code(
  p_session_id UUID,
  p_payload TEXT,
  p_timestamp BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
  stored_secret TEXT;
  qr_expiry TIMESTAMPTZ;
  now_timestamp BIGINT;
  time_difference BIGINT;
BEGIN
  -- Get stored QR data and expiry
  SELECT qr_code_data, qr_expires_at
  INTO stored_secret, qr_expiry
  FROM public.sessions
  WHERE id = p_session_id;

  -- Check if QR code exists for this session
  IF stored_secret IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if QR code has expired
  IF qr_expiry < NOW() THEN
    RETURN FALSE;
  END IF;

  -- Verify secret matches
  IF stored_secret != p_payload THEN
    RETURN FALSE;
  END IF;

  -- Check timestamp is within acceptable range (±5 minutes)
  now_timestamp := EXTRACT(EPOCH FROM NOW())::BIGINT * 1000;
  time_difference := ABS(now_timestamp - p_timestamp);

  IF time_difference > 300000 THEN -- 5 minutes in milliseconds
    RETURN FALSE;
  END IF;

  -- All validations passed
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.validate_qr_code IS 'Validate QR code for session attendance. Checks secret match, expiry time, and timestamp validity (±5 minutes).';

-- =====================================================
-- FUNCTION: Calculate attendance rate for enrollment
-- =====================================================
CREATE OR REPLACE FUNCTION public.calculate_attendance_rate(p_enrollment_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_sessions INTEGER;
  attended_sessions INTEGER;
  attendance_rate DECIMAL(5,2);
  activity_id_var UUID;
BEGIN
  -- Get activity_id from enrollment
  SELECT activity_id INTO activity_id_var
  FROM public.enrollments
  WHERE id = p_enrollment_id;

  -- Count total sessions for this activity
  SELECT COUNT(*) INTO total_sessions
  FROM public.sessions
  WHERE activity_id = activity_id_var
    AND deleted_at IS NULL;

  -- If no sessions exist, return 0
  IF total_sessions = 0 THEN
    RETURN 0.00;
  END IF;

  -- Count attended sessions (where enrollment has attendance_status = 'PRESENT')
  -- This requires checking if session attendance was validated
  SELECT COUNT(DISTINCT s.id) INTO attended_sessions
  FROM public.sessions s
  WHERE s.activity_id = activity_id_var
    AND s.deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = p_enrollment_id
        AND e.attendance_status = 'PRESENT'
        AND e.attended_at IS NOT NULL
        -- Verify attendance timestamp is within session timeframe
        AND DATE(e.attended_at) = s.date
    );

  -- Calculate percentage
  attendance_rate := (attended_sessions::DECIMAL / total_sessions::DECIMAL) * 100;

  RETURN ROUND(attendance_rate, 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.calculate_attendance_rate IS 'Calculate attendance rate (%) for an enrollment based on attended sessions vs total sessions.';

-- =====================================================
-- FUNCTION: Create audit log entry
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_performed_by UUID,
  p_changes JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  audit_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    action,
    entity_type,
    entity_id,
    performed_by,
    changes,
    ip_address,
    user_agent
  ) VALUES (
    p_action,
    p_entity_type,
    p_entity_id,
    p_performed_by,
    p_changes,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO audit_log_id;

  RETURN audit_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.create_audit_log IS 'Helper function to create audit log entries. Use from triggers or Edge Functions to track important actions.';

-- =====================================================
-- Example Trigger: Audit activity creation
-- =====================================================
CREATE OR REPLACE FUNCTION public.audit_activity_changes()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  changes_json JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    action_type := 'CREATE';
    changes_json := TO_JSONB(NEW);

  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'UPDATE';
    changes_json := JSONB_BUILD_OBJECT(
      'old', TO_JSONB(OLD),
      'new', TO_JSONB(NEW)
    );

  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'DELETE';
    changes_json := TO_JSONB(OLD);
  END IF;

  PERFORM public.create_audit_log(
    action_type,
    'ACTIVITY',
    COALESCE(NEW.id, OLD.id),
    COALESCE(NEW.created_by, OLD.created_by, auth.uid()),
    changes_json
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.audit_activity_changes IS 'Trigger function to audit all activity changes (CREATE, UPDATE, DELETE)';

CREATE TRIGGER audit_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.audit_activity_changes();

-- =====================================================
-- Migration Complete
-- =====================================================
