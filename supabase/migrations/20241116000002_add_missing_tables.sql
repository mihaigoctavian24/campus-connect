-- =====================================================
-- Migration: Add Missing Critical Tables
-- Version: 1.0
-- Date: 2024-11-16
-- Description: Adds 6 critical tables identified in cross-check
-- Tables: sessions, hours_requests, saved_opportunities,
--         departments, email_templates
-- Plus: Alter activities and profiles to link to departments
-- =====================================================

-- =====================================================
-- TABLE 1: sessions - CRITICAL
-- Enables: Session scheduling, QR codes, session-based attendance
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Session Details
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,

  -- Status
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),

  -- Capacity
  max_participants INTEGER,

  -- QR Code System
  qr_code_data TEXT, -- Encrypted QR payload
  qr_expires_at TIMESTAMPTZ, -- QR code expiration

  -- GPS Validation
  location_hash TEXT, -- For GPS validation (±15m radius)

  -- Automation
  reminder_sent BOOLEAN DEFAULT FALSE, -- Automated session reminders

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_activity ON public.sessions(activity_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON public.sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_qr_expires ON public.sessions(qr_expires_at) WHERE qr_expires_at IS NOT NULL;

COMMENT ON TABLE public.sessions IS 'Activity sessions with QR code and GPS validation support';
COMMENT ON COLUMN public.sessions.qr_code_data IS 'Encrypted QR code payload for attendance validation';
COMMENT ON COLUMN public.sessions.location_hash IS 'Geohash for GPS proximity validation (±15m)';

-- =====================================================
-- TABLE 2: hours_requests - CRITICAL
-- Enables: Student hours logging, professor validation workflow
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hours_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  activity_id UUID NOT NULL REFERENCES public.activities(id),

  -- Hours Details
  hours DECIMAL(5,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  date DATE NOT NULL,
  description TEXT NOT NULL,

  -- Evidence
  evidence_urls TEXT[], -- File URLs from Supabase Storage

  -- Status
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),

  -- Professor Feedback
  professor_notes TEXT, -- Feedback when rejecting or requesting more info
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for hours_requests
CREATE INDEX IF NOT EXISTS idx_hours_requests_user ON public.hours_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_hours_requests_status ON public.hours_requests(status);
CREATE INDEX IF NOT EXISTS idx_hours_requests_enrollment ON public.hours_requests(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_hours_requests_activity ON public.hours_requests(activity_id);
CREATE INDEX IF NOT EXISTS idx_hours_requests_approved_by ON public.hours_requests(approved_by) WHERE approved_by IS NOT NULL;

COMMENT ON TABLE public.hours_requests IS 'Student hours logging with professor validation workflow';

-- =====================================================
-- TABLE 3: saved_opportunities - HIGH PRIORITY
-- Enables: Students can save opportunities for later
-- =====================================================
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Metadata
  saved_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, activity_id)
);

-- Indexes for saved_opportunities
CREATE INDEX IF NOT EXISTS idx_saved_user ON public.saved_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_activity ON public.saved_opportunities(activity_id);

COMMENT ON TABLE public.saved_opportunities IS 'Student saved opportunities (bookmarks)';

-- =====================================================
-- TABLE 4: departments - HIGH PRIORITY
-- Enables: Department organization, department management
-- =====================================================
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Department Details
  name TEXT UNIQUE NOT NULL,
  short_code TEXT UNIQUE NOT NULL, -- e.g., "ES" for Engineering Society
  description TEXT,

  -- Contact Information
  contact_name TEXT,
  contact_email TEXT,

  -- Branding
  logo_url TEXT, -- Supabase Storage URL

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for departments
CREATE INDEX IF NOT EXISTS idx_departments_active ON public.departments(is_active);
CREATE INDEX IF NOT EXISTS idx_departments_short_code ON public.departments(short_code);

COMMENT ON TABLE public.departments IS 'University departments organizing opportunities';

-- =====================================================
-- ALTER EXISTING TABLES: Link to departments
-- =====================================================

-- Add department_id to activities
ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id);

CREATE INDEX IF NOT EXISTS idx_activities_department ON public.activities(department_id);

COMMENT ON COLUMN public.activities.department_id IS 'Department organizing this activity';

-- Add department_id to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id);

CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department_id);

COMMENT ON COLUMN public.profiles.department_id IS 'User department affiliation';

-- =====================================================
-- TABLE 5: email_templates - HIGH PRIORITY
-- Enables: Customizable notification emails
-- =====================================================
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Template Type
  template_type TEXT UNIQUE NOT NULL CHECK (template_type IN (
    'application_accepted',
    'application_rejected',
    'session_reminder_24h',
    'session_reminder_1h',
    'hours_approved',
    'hours_rejected',
    'activity_completed',
    'certificate_ready',
    'professor_approved',
    'professor_rejected'
  )),

  -- Template Content
  subject TEXT NOT NULL,
  body TEXT NOT NULL, -- Supports {{variables}}
  variables JSONB, -- Available variable list

  -- Optional per-department templates
  department_id UUID REFERENCES public.departments(id),

  -- Metadata
  created_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for email_templates
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON public.email_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_email_templates_department ON public.email_templates(department_id) WHERE department_id IS NOT NULL;

COMMENT ON TABLE public.email_templates IS 'Customizable email notification templates';
COMMENT ON COLUMN public.email_templates.body IS 'Email body with variable placeholders like {{student_name}}';

-- =====================================================
-- Migration Complete
-- =====================================================
