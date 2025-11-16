-- =====================================================
-- Migration: Row Level Security (RLS) Policies
-- Version: 1.0
-- Date: 2024-11-16
-- Description: Enable RLS and create security policies for all tables
-- Security Model: Role-based access control (STUDENT, PROFESSOR, ADMIN)
-- =====================================================

-- =====================================================
-- PROFILES - RLS Policies
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Professors can view enrolled students
CREATE POLICY "Professors can view enrolled students"
  ON public.profiles FOR SELECT
  USING (
    role = 'STUDENT' AND
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.activities a ON e.activity_id = a.id
      WHERE e.user_id = profiles.id
        AND a.created_by = auth.uid()
        AND e.deleted_at IS NULL
    )
  );

-- =====================================================
-- CATEGORIES - RLS Policies
-- =====================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- ACTIVITIES - RLS Policies
-- =====================================================
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Anyone can view open activities
CREATE POLICY "Anyone can view open activities"
  ON public.activities FOR SELECT
  USING (status = 'OPEN' AND deleted_at IS NULL);

-- Professors can view their own activities
CREATE POLICY "Professors can view their own activities"
  ON public.activities FOR SELECT
  USING (created_by = auth.uid());

-- Professors can create activities
CREATE POLICY "Professors can create activities"
  ON public.activities FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('PROFESSOR', 'ADMIN')
    )
  );

-- Professors can update their own activities
CREATE POLICY "Professors can update their own activities"
  ON public.activities FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Professors can delete their own activities
CREATE POLICY "Professors can delete their own activities"
  ON public.activities FOR DELETE
  USING (created_by = auth.uid());

-- Admins can manage all activities
CREATE POLICY "Admins can manage all activities"
  ON public.activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Students can view activities they enrolled in
CREATE POLICY "Students can view activities they enrolled in"
  ON public.activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE activity_id = activities.id
        AND user_id = auth.uid()
        AND deleted_at IS NULL
    )
  );

-- =====================================================
-- ENROLLMENTS - RLS Policies
-- =====================================================
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  USING (user_id = auth.uid());

-- Students can enroll in activities
CREATE POLICY "Students can enroll in activities"
  ON public.enrollments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'STUDENT'
    )
  );

-- Students can cancel their own enrollments
CREATE POLICY "Students can cancel their own enrollments"
  ON public.enrollments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Professors can view enrollments for their activities
CREATE POLICY "Professors can view enrollments for their activities"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE id = enrollments.activity_id
        AND created_by = auth.uid()
    )
  );

-- Professors can update attendance for their activities
CREATE POLICY "Professors can update attendance for their activities"
  ON public.enrollments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE id = enrollments.activity_id
        AND created_by = auth.uid()
    )
  );

-- Admins can manage all enrollments
CREATE POLICY "Admins can manage all enrollments"
  ON public.enrollments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- SESSIONS - RLS Policies
-- =====================================================
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Professors can manage sessions for their activities
CREATE POLICY "Professors can manage their activity sessions"
  ON public.sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE id = sessions.activity_id
        AND created_by = auth.uid()
    )
  );

-- Students can view sessions for enrolled activities
CREATE POLICY "Students can view enrolled activity sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.activity_id = sessions.activity_id
        AND e.user_id = auth.uid()
        AND e.deleted_at IS NULL
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

-- =====================================================
-- HOURS_REQUESTS - RLS Policies
-- =====================================================
ALTER TABLE public.hours_requests ENABLE ROW LEVEL SECURITY;

-- Students can view their own hours requests
CREATE POLICY "Students can view their own hours requests"
  ON public.hours_requests FOR SELECT
  USING (user_id = auth.uid());

-- Students can create hours requests
CREATE POLICY "Students can create hours requests"
  ON public.hours_requests FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'STUDENT'
    )
  );

-- Students can update their own pending hours requests
CREATE POLICY "Students can update pending hours requests"
  ON public.hours_requests FOR UPDATE
  USING (user_id = auth.uid() AND status = 'PENDING')
  WITH CHECK (user_id = auth.uid() AND status = 'PENDING');

-- Professors can view hours requests for their activities
CREATE POLICY "Professors can view activity hours requests"
  ON public.hours_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE id = hours_requests.activity_id
        AND created_by = auth.uid()
    )
  );

-- Professors can approve/reject hours requests
CREATE POLICY "Professors can validate hours requests"
  ON public.hours_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE id = hours_requests.activity_id
        AND created_by = auth.uid()
    )
  );

-- Admins can manage all hours requests
CREATE POLICY "Admins can manage all hours requests"
  ON public.hours_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- SAVED_OPPORTUNITIES - RLS Policies
-- =====================================================
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Students can manage their own saved opportunities
CREATE POLICY "Students can manage saved opportunities"
  ON public.saved_opportunities FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- NOTIFICATIONS - RLS Policies
-- =====================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- System can create notifications (handled by triggers/functions)
CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (TRUE);

-- =====================================================
-- CERTIFICATES - RLS Policies
-- =====================================================
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Users can view their own certificates
CREATE POLICY "Users can view their own certificates"
  ON public.certificates FOR SELECT
  USING (user_id = auth.uid());

-- Professors can view certificates for their activities
CREATE POLICY "Professors can view activity certificates"
  ON public.certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE id = certificates.activity_id
        AND created_by = auth.uid()
    )
  );

-- System can create certificates (handled by functions)
CREATE POLICY "System can create certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (TRUE);

-- Admins can manage all certificates
CREATE POLICY "Admins can manage all certificates"
  ON public.certificates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- AUDIT_LOGS - RLS Policies
-- =====================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- System can create audit logs
CREATE POLICY "System can create audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- =====================================================
-- FEEDBACK - RLS Policies
-- =====================================================
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Users can view approved feedback
CREATE POLICY "Users can view approved feedback"
  ON public.feedback FOR SELECT
  USING (is_approved = TRUE);

-- Students can create feedback for their enrollments
CREATE POLICY "Students can create feedback for enrollments"
  ON public.feedback FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE id = feedback.enrollment_id
        AND user_id = auth.uid()
    )
  );

-- Students can view their own feedback (even if not approved)
CREATE POLICY "Students can view their own feedback"
  ON public.feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE id = feedback.enrollment_id
        AND user_id = auth.uid()
    )
  );

-- Admins can manage all feedback
CREATE POLICY "Admins can manage all feedback"
  ON public.feedback FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- DEPARTMENTS - RLS Policies
-- =====================================================
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Anyone can view active departments
CREATE POLICY "Anyone can view active departments"
  ON public.departments FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage departments
CREATE POLICY "Admins can manage departments"
  ON public.departments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- EMAIL_TEMPLATES - RLS Policies
-- =====================================================
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Admins can manage email templates
CREATE POLICY "Admins can manage email templates"
  ON public.email_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- System can read email templates (for sending emails)
CREATE POLICY "System can read email templates"
  ON public.email_templates FOR SELECT
  USING (TRUE);

-- =====================================================
-- PLATFORM_SETTINGS - RLS Policies
-- =====================================================
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings (read-only for public)
CREATE POLICY "Anyone can view platform settings"
  ON public.platform_settings FOR SELECT
  USING (TRUE);

-- Admins can manage platform settings
CREATE POLICY "Admins can manage platform settings"
  ON public.platform_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- Migration Complete
-- =====================================================
