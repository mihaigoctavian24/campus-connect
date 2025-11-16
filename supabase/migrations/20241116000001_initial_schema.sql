-- =====================================================
-- Migration: Initial Database Schema
-- Version: 1.0
-- Date: 2024-11-16
-- Description: Creates core tables for Campus Connect
-- Tables: profiles, categories, activities, enrollments,
--         notifications, certificates, audit_logs, feedback,
--         platform_settings
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: profiles (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  -- Primary Key (references auth.users.id)
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Personal Information
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  profile_picture_url TEXT,

  -- Academic Information (nullable for professors/admins)
  faculty TEXT,
  specialization TEXT,
  year INTEGER CHECK (year >= 1 AND year <= 6),
  program_type TEXT CHECK (program_type IN ('LICENSE', 'MASTER', 'DOCTORAT')),

  -- Role & Status
  role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'PROFESSOR', 'ADMIN')),
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE NOT NULL,

  -- Metadata
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_faculty ON public.profiles(faculty) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase Auth users';
COMMENT ON COLUMN public.profiles.role IS 'User role: STUDENT, PROFESSOR, or ADMIN';
COMMENT ON COLUMN public.profiles.deleted_at IS 'Soft delete timestamp';

-- =====================================================
-- TABLE 2: categories
-- =====================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Category Details
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT, -- Hex color for UI
  icon TEXT,  -- Icon name or emoji

  -- Status
  is_active BOOLEAN DEFAULT TRUE NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);

COMMENT ON TABLE public.categories IS 'Activity categories for organization and filtering';

-- =====================================================
-- TABLE 3: activities
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,

  -- Schedule
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,

  -- Capacity
  max_participants INTEGER NOT NULL CHECK (max_participants > 0),
  current_participants INTEGER DEFAULT 0 NOT NULL CHECK (current_participants >= 0),

  -- Eligibility
  eligibility_criteria TEXT,

  -- Status
  status TEXT DEFAULT 'OPEN' NOT NULL
    CHECK (status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),

  -- Relations
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for activities
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities(date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON public.activities(created_by) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_activities_date_status ON public.activities(date, status) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.activities IS 'Volunteering activities/events';

-- =====================================================
-- TABLE 4: enrollments
-- =====================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Enrollment Status
  status TEXT DEFAULT 'CONFIRMED' NOT NULL
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'WAITLISTED')),

  -- Timestamps
  enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  cancelled_at TIMESTAMPTZ,

  -- Attendance
  attendance_status TEXT CHECK (attendance_status IN ('PENDING', 'PRESENT', 'ABSENT')),
  attendance_validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES public.profiles(id),

  -- Feedback
  feedback_submitted BOOLEAN DEFAULT FALSE NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,

  -- Constraints
  UNIQUE(activity_id, user_id)
);

-- Indexes for enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_activity ON public.enrollments(activity_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_enrollments_attendance ON public.enrollments(attendance_status) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.enrollments IS 'Student enrollments in activities';

-- =====================================================
-- TABLE 5: notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  related_activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Notification Content
  type TEXT NOT NULL
    CHECK (type IN (
      'ACTIVITY_NEW', 'ACTIVITY_UPDATED', 'ACTIVITY_CANCELLED',
      'ENROLLMENT_CONFIRMED', 'ENROLLMENT_CANCELLED',
      'REMINDER', 'ATTENDANCE_VALIDATED', 'CERTIFICATE_READY'
    )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Status
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  read_at TIMESTAMPTZ,
  email_sent BOOLEAN DEFAULT FALSE NOT NULL,
  email_sent_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_activity ON public.notifications(related_activity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

COMMENT ON TABLE public.notifications IS 'In-app and email notifications';

-- =====================================================
-- TABLE 6: certificates
-- =====================================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,

  -- Certificate Details
  certificate_url TEXT NOT NULL, -- Supabase Storage URL
  certificate_number TEXT UNIQUE NOT NULL, -- Unique identifier

  -- Issuance
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  issued_by UUID NOT NULL REFERENCES public.profiles(id),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(enrollment_id) -- One certificate per enrollment
);

-- Indexes for certificates
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_activity ON public.certificates(activity_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON public.certificates(certificate_number);

COMMENT ON TABLE public.certificates IS 'Generated certificates for participation';

-- =====================================================
-- TABLE 7: audit_logs
-- =====================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Actor
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Action
  action TEXT NOT NULL, -- e.g., "USER_DELETED", "ACTIVITY_CREATED"
  entity_type TEXT NOT NULL, -- e.g., "User", "Activity"
  entity_id UUID,

  -- Details
  details JSONB, -- Additional context

  -- Request Info
  ip_address TEXT,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

COMMENT ON TABLE public.audit_logs IS 'Audit trail for critical actions';

-- =====================================================
-- TABLE 8: feedback
-- =====================================================
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,

  -- Feedback Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  -- Moderation
  is_moderated BOOLEAN DEFAULT FALSE NOT NULL,
  is_approved BOOLEAN,
  moderated_by UUID REFERENCES public.profiles(id),
  moderated_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(enrollment_id) -- One feedback per enrollment
);

-- Indexes for feedback
CREATE INDEX IF NOT EXISTS idx_feedback_enrollment ON public.feedback(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_moderated ON public.feedback(is_moderated, is_approved);

COMMENT ON TABLE public.feedback IS 'Student feedback for activities';

-- =====================================================
-- TABLE 9: platform_settings
-- =====================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Setting Key-Value
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,

  -- Metadata
  updated_by UUID NOT NULL REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for platform_settings
CREATE INDEX IF NOT EXISTS idx_platform_settings_key ON public.platform_settings(key);

COMMENT ON TABLE public.platform_settings IS 'Global platform configuration';

-- =====================================================
-- Migration Complete
-- =====================================================
