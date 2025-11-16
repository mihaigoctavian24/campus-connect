-- =====================================================
-- Migration: Seed Data
-- Version: 1.0
-- Date: 2024-11-16
-- Description: Insert initial seed data for categories,
--              platform settings, departments, and email templates
-- =====================================================

-- =====================================================
-- SEED 1: Categories
-- =====================================================
INSERT INTO public.categories (name, description, color, icon, is_active) VALUES
  ('Educație', 'Activități educaționale și tutoriat pentru studenți', '#3B82F6', '📚', TRUE),
  ('Social', 'Asistență socială și sprijin comunitar', '#10B981', '🤝', TRUE),
  ('Mediu', 'Protecția mediului și acțiuni ecologice', '#22C55E', '🌱', TRUE),
  ('Sănătate', 'Campanii de sănătate și donare de sânge', '#EF4444', '❤️', TRUE),
  ('Cultură', 'Evenimente culturale și artistice', '#8B5CF6', '🎨', TRUE),
  ('Sport', 'Evenimente sportive și activități recreative', '#F59E0B', '⚽', TRUE),
  ('Tehnologie', 'Workshop-uri tech și digitalizare', '#06B6D4', '💻', TRUE),
  ('Incluziune', 'Promovarea diversității și incluziunii', '#EC4899', '🌈', TRUE)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SEED 2: Departments
-- =====================================================
INSERT INTO public.departments (name, short_code, description, is_active) VALUES
  (
    'Engineering Society',
    'ES',
    'Student organization for engineering students promoting technical excellence and innovation',
    TRUE
  ),
  (
    'Business Society',
    'BS',
    'Organization for business and entrepreneurship students',
    TRUE
  ),
  (
    'Arts & Culture Society',
    'ACS',
    'Promoting arts, culture and creative expression',
    TRUE
  ),
  (
    'Social Impact Club',
    'SIC',
    'Dedicated to community service and social responsibility',
    TRUE
  ),
  (
    'Sports & Wellness',
    'SW',
    'Organizing sports events and wellness activities',
    TRUE
  ),
  (
    'Tech Innovation Lab',
    'TIL',
    'Technology workshops and innovation projects',
    TRUE
  )
ON CONFLICT (short_code) DO NOTHING;

-- =====================================================
-- SEED 3: Platform Settings
-- =====================================================

-- First, ensure the admin user exists in profiles
-- Insert admin profile if it doesn't exist (linked to auth.users)
INSERT INTO public.profiles (id, email, first_name, last_name, role, email_verified, is_active)
VALUES (
  '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID,
  'octavianmihai@example.com',
  'Octavian',
  'Mihai',
  'ADMIN',
  TRUE,
  TRUE
)
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN', email_verified = TRUE;

-- Insert platform settings using admin UUID
INSERT INTO public.platform_settings (key, value, description, updated_by) VALUES
  (
    'academic_year_start',
    '{"value": "2024-09-15"}'::JSONB,
    'Start date of the current academic year',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'academic_year_end',
    '{"value": "2025-06-30"}'::JSONB,
    'End date of the current academic year',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'max_applications_per_student',
    '{"value": 10}'::JSONB,
    'Maximum number of concurrent activity enrollments per student',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'min_hours_for_certificate',
    '{"value": 10}'::JSONB,
    'Minimum volunteering hours required to earn a certificate',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'enrollment_deadline_hours',
    '{"value": 24}'::JSONB,
    'Hours before activity start when enrollment closes',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'cancellation_deadline_hours',
    '{"value": 48}'::JSONB,
    'Hours before activity start when cancellation is allowed',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'qr_code_validity_minutes',
    '{"value": 30}'::JSONB,
    'QR code validity duration in minutes for attendance',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'gps_proximity_radius_meters',
    '{"value": 15}'::JSONB,
    'GPS proximity radius in meters for location validation',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'platform_name',
    '{"value": "Campus Connect"}'::JSONB,
    'Official platform name',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'platform_email',
    '{"value": "contact@campusconnect-scs.work"}'::JSONB,
    'Official platform contact email',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'notification_preferences',
    '{"email": true, "in_app": true, "reminder_24h": true, "reminder_1h": true}'::JSONB,
    'Default notification preferences for new users',
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  )
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- SEED 4: Email Templates
-- =====================================================
INSERT INTO public.email_templates (template_type, subject, body, variables, created_by) VALUES
  (
    'application_accepted',
    'Your Application Was Accepted - {{activity_title}}',
    'Hi {{student_name}},

Great news! Your application for "{{activity_title}}" has been accepted.

**Activity Details:**
- Date: {{activity_date}}
- Time: {{activity_time}}
- Location: {{activity_location}}

Please make sure to attend on time. We look forward to seeing you there!

Best regards,
Campus Connect Team',
    '{"student_name": "Student full name", "activity_title": "Activity name", "activity_date": "Activity date", "activity_time": "Activity time", "activity_location": "Activity location"}'::JSONB,
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'session_reminder_24h',
    'Reminder: Activity Tomorrow - {{activity_title}}',
    'Hi {{student_name}},

This is a friendly reminder that you have an activity scheduled for tomorrow:

**Activity:** {{activity_title}}
**Date:** {{activity_date}}
**Time:** {{activity_time}}
**Location:** {{activity_location}}

See you there!

Best regards,
Campus Connect Team',
    '{"student_name": "Student full name", "activity_title": "Activity name", "activity_date": "Activity date", "activity_time": "Activity time", "activity_location": "Activity location"}'::JSONB,
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'hours_approved',
    'Hours Approved - {{activity_title}}',
    'Hi {{student_name}},

Your volunteering hours have been approved!

**Activity:** {{activity_title}}
**Hours Approved:** {{hours}} hours
**Total Hours:** {{total_hours}} hours

Keep up the great work!

Best regards,
Campus Connect Team',
    '{"student_name": "Student full name", "activity_title": "Activity name", "hours": "Approved hours", "total_hours": "Cumulative total hours"}'::JSONB,
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'hours_rejected',
    'Hours Request Needs Revision - {{activity_title}}',
    'Hi {{student_name}},

Your hours request for "{{activity_title}}" needs some revision.

**Reason:** {{rejection_reason}}

**Professor Notes:** {{professor_notes}}

Please review the feedback and resubmit your request with the necessary corrections.

Best regards,
Campus Connect Team',
    '{"student_name": "Student full name", "activity_title": "Activity name", "rejection_reason": "Rejection reason", "professor_notes": "Additional notes from professor"}'::JSONB,
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'certificate_ready',
    'Your Certificate is Ready - {{activity_title}}',
    'Hi {{student_name}},

Congratulations! Your certificate for "{{activity_title}}" is now available.

**Certificate Number:** {{certificate_number}}

You can download your certificate from your dashboard.

Best regards,
Campus Connect Team',
    '{"student_name": "Student full name", "activity_title": "Activity name", "certificate_number": "Unique certificate number"}'::JSONB,
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  ),
  (
    'professor_approved',
    'Your Professor Account Was Approved',
    'Hi {{professor_name}},

Welcome to Campus Connect! Your professor account has been approved.

You can now:
- Create volunteering opportunities
- Manage student enrollments
- Validate attendance and hours
- Generate reports

Login to get started: {{platform_url}}

Best regards,
Campus Connect Team',
    '{"professor_name": "Professor full name", "platform_url": "Platform URL"}'::JSONB,
    '4364312d-27a2-4796-9371-c1a99f6b04c1'::UUID
  )
ON CONFLICT (template_type) DO NOTHING;

-- =====================================================
-- NOTES
-- =====================================================
-- After running this migration:
-- 1. Create first admin user manually in Supabase Auth
-- 2. Update that user's profile: UPDATE profiles SET role = 'ADMIN' WHERE email = 'admin@stud.rau.ro';
-- 3. Run: UPDATE platform_settings SET updated_by = (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1);
-- 4. Run: UPDATE email_templates SET created_by = (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1);

-- =====================================================
-- Migration Complete
-- =====================================================
