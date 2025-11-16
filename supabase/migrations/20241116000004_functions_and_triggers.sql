-- =====================================================
-- Migration: Database Functions and Triggers
-- Version: 1.0
-- Date: 2024-11-16
-- Description: Create database functions and triggers
-- Functions: Auto-update timestamps, profile creation,
--            participant counting, capacity checks, status updates
-- =====================================================

-- =====================================================
-- FUNCTION 1: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.handle_updated_at() IS 'Auto-update updated_at column on row modification';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.hours_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- FUNCTION 2: Auto-create profile on user signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT'),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Auto-create profile when user signs up via Supabase Auth';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCTION 3: Update activity participant count
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_activity_participants()
RETURNS TRIGGER AS $$
BEGIN
  -- When enrollment is confirmed
  IF TG_OP = 'INSERT' AND NEW.status = 'CONFIRMED' THEN
    UPDATE public.activities
    SET current_participants = current_participants + 1
    WHERE id = NEW.activity_id;

  -- When enrollment status changes from CONFIRMED to CANCELLED
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'CONFIRMED' AND NEW.status = 'CANCELLED' THEN
    UPDATE public.activities
    SET current_participants = current_participants - 1
    WHERE id = NEW.activity_id;

  -- When enrollment status changes from CANCELLED to CONFIRMED
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'CANCELLED' AND NEW.status = 'CONFIRMED' THEN
    UPDATE public.activities
    SET current_participants = current_participants + 1
    WHERE id = NEW.activity_id;

  -- When confirmed enrollment is deleted
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'CONFIRMED' THEN
    UPDATE public.activities
    SET current_participants = current_participants - 1
    WHERE id = OLD.activity_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_activity_participants() IS 'Auto-update activity participant count based on enrollments';

CREATE TRIGGER update_participants_on_enrollment
  AFTER INSERT OR UPDATE OR DELETE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_activity_participants();

-- =====================================================
-- FUNCTION 4: Prevent enrollment when activity is full
-- =====================================================
CREATE OR REPLACE FUNCTION public.check_activity_capacity()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_count INTEGER;
BEGIN
  -- Only check for new confirmed enrollments or status change to confirmed
  IF (TG_OP = 'INSERT' AND NEW.status = 'CONFIRMED') OR
     (TG_OP = 'UPDATE' AND OLD.status != 'CONFIRMED' AND NEW.status = 'CONFIRMED') THEN

    SELECT current_participants, max_participants
    INTO current_count, max_count
    FROM public.activities
    WHERE id = NEW.activity_id;

    IF current_count >= max_count THEN
      RAISE EXCEPTION 'Activity is full. No more enrollments allowed.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.check_activity_capacity() IS 'Prevent enrollments when activity reaches max capacity';

CREATE TRIGGER check_capacity_before_enrollment
  BEFORE INSERT OR UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.check_activity_capacity();

-- =====================================================
-- FUNCTION 5: Auto-update activity status based on date/time
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_activity_status()
RETURNS void AS $$
BEGIN
  -- Mark as IN_PROGRESS if start time has passed
  UPDATE public.activities
  SET status = 'IN_PROGRESS'
  WHERE status = 'OPEN'
    AND date = CURRENT_DATE
    AND start_time <= CURRENT_TIME
    AND deleted_at IS NULL;

  -- Mark as COMPLETED if end time has passed
  UPDATE public.activities
  SET status = 'COMPLETED'
  WHERE status IN ('OPEN', 'IN_PROGRESS')
    AND (
      date < CURRENT_DATE OR
      (date = CURRENT_DATE AND end_time < CURRENT_TIME)
    )
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_activity_status() IS 'Update activity status based on current date/time. Should be called via cron job or Edge Function.';

-- =====================================================
-- FUNCTION 6: Generate unique certificate number
-- =====================================================
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
  cert_number TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate format: CC-YYYY-XXXXXX (e.g., CC-2024-AB1234)
    cert_number := 'CC-' ||
                   TO_CHAR(CURRENT_DATE, 'YYYY') || '-' ||
                   UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

    -- Check if number already exists
    SELECT COUNT(*) INTO exists_check
    FROM public.certificates
    WHERE certificate_number = cert_number;

    -- Exit loop if unique
    EXIT WHEN exists_check = 0;
  END LOOP;

  RETURN cert_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_certificate_number() IS 'Generate unique certificate number in format CC-YYYY-XXXXXX';

-- =====================================================
-- FUNCTION 7: Create notification helper
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_activity_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    related_activity_id
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_activity_id
  )
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.create_notification IS 'Helper function to create notifications from triggers or Edge Functions';

-- =====================================================
-- FUNCTION 8: Auto-notify on enrollment status change
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_enrollment_status()
RETURNS TRIGGER AS $$
DECLARE
  activity_title TEXT;
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Get activity title
  SELECT title INTO activity_title
  FROM public.activities
  WHERE id = NEW.activity_id;

  -- Determine notification type and content based on status
  IF NEW.status = 'CONFIRMED' AND (TG_OP = 'INSERT' OR OLD.status != 'CONFIRMED') THEN
    notification_type := 'ENROLLMENT_CONFIRMED';
    notification_title := 'Enrollment Confirmed';
    notification_message := 'Your enrollment for "' || activity_title || '" has been confirmed.';

  ELSIF NEW.status = 'CANCELLED' AND OLD.status = 'CONFIRMED' THEN
    notification_type := 'ENROLLMENT_CANCELLED';
    notification_title := 'Enrollment Cancelled';
    notification_message := 'Your enrollment for "' || activity_title || '" has been cancelled.';

  ELSIF NEW.attendance_status = 'PRESENT' AND (OLD.attendance_status IS NULL OR OLD.attendance_status != 'PRESENT') THEN
    notification_type := 'ATTENDANCE_VALIDATED';
    notification_title := 'Attendance Confirmed';
    notification_message := 'Your attendance for "' || activity_title || '" has been validated.';

  ELSE
    -- No notification needed for other status changes
    RETURN NEW;
  END IF;

  -- Create notification
  PERFORM public.create_notification(
    NEW.user_id,
    notification_type,
    notification_title,
    notification_message,
    NEW.activity_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.notify_enrollment_status() IS 'Auto-create notifications when enrollment or attendance status changes';

CREATE TRIGGER notify_on_enrollment_change
  AFTER INSERT OR UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.notify_enrollment_status();

-- =====================================================
-- FUNCTION 9: Auto-notify on hours request status change
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_hours_status()
RETURNS TRIGGER AS $$
DECLARE
  activity_title TEXT;
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Only notify on status changes (not on creation)
  IF TG_OP = 'INSERT' OR OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get activity title
  SELECT title INTO activity_title
  FROM public.activities
  WHERE id = NEW.activity_id;

  -- Determine notification content based on status
  IF NEW.status = 'APPROVED' THEN
    notification_type := 'hours_approved';
    notification_title := 'Hours Approved';
    notification_message := 'Your ' || NEW.hours || ' volunteering hours for "' || activity_title || '" have been approved.';

  ELSIF NEW.status = 'REJECTED' THEN
    notification_type := 'hours_rejected';
    notification_title := 'Hours Rejected';
    notification_message := 'Your hours request for "' || activity_title || '" was rejected. Reason: ' || COALESCE(NEW.rejection_reason, 'No reason provided');

  ELSE
    RETURN NEW;
  END IF;

  -- Create notification
  PERFORM public.create_notification(
    NEW.user_id,
    notification_type,
    notification_title,
    notification_message,
    NEW.activity_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.notify_hours_status() IS 'Auto-create notifications when hours request status changes';

CREATE TRIGGER notify_on_hours_change
  AFTER UPDATE ON public.hours_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_hours_status();

-- =====================================================
-- FUNCTION 10: Calculate total approved hours for user
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_total_hours(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_hours DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(hours), 0)
  INTO total_hours
  FROM public.hours_requests
  WHERE user_id = p_user_id
    AND status = 'APPROVED';

  RETURN total_hours;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.get_user_total_hours IS 'Calculate total approved volunteering hours for a user';

-- =====================================================
-- Migration Complete
-- =====================================================
