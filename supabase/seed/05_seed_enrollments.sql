-- Seed Enrollments
-- Creates test enrollments for student 1 (Ana Popescu)
-- This will populate the student dashboard with realistic data

-- Enrollment 1: STEM Mentorship (Active, with attendance)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  attendance_validated_at,
  validated_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  '11111111-1111-1111-1111-111111111111',
  'CONFIRMED',
  '2025-11-10 14:30:00',
  'PRESENT',
  '2025-11-10 20:05:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 2: Community Outreach (Active, pending attendance)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status
) VALUES (
  '770e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440002',
  '11111111-1111-1111-1111-111111111111',
  'CONFIRMED',
  '2025-11-12 09:15:00',
  'PENDING'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 3: Math Tutoring (Active, with attendance)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  attendance_validated_at,
  validated_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440004',
  '11111111-1111-1111-1111-111111111111',
  'CONFIRMED',
  '2025-11-08 10:00:00',
  'PRESENT',
  '2025-11-08 18:10:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 4: Cultural Festival (Completed)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  attendance_validated_at,
  validated_by,
  feedback_submitted
) VALUES (
  '770e8400-e29b-41d4-a716-446655440004',
  '660e8400-e29b-41d4-a716-446655440005',
  '11111111-1111-1111-1111-111111111111',
  'CONFIRMED',
  '2025-10-01 08:00:00',
  'PRESENT',
  '2025-10-15 18:30:00',
  '33333333-3333-3333-3333-333333333333',
  true
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 5: River Cleanup (Pending)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status
) VALUES (
  '770e8400-e29b-41d4-a716-446655440005',
  '660e8400-e29b-41d4-a716-446655440003',
  '11111111-1111-1111-1111-111111111111',
  'PENDING',
  '2025-11-15 16:20:00',
  'PENDING'
) ON CONFLICT (id) DO NOTHING;

-- Add some enrollments for student 2 as well
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status
) VALUES (
  '770e8400-e29b-41d4-a716-446655440006',
  '660e8400-e29b-41d4-a716-446655440002',
  '22222222-2222-2222-2222-222222222222',
  'CONFIRMED',
  '2025-11-11 11:00:00',
  'PENDING'
) ON CONFLICT (id) DO NOTHING;

-- Verify enrollments for student 1
SELECT
  e.id,
  e.status,
  e.attendance_status,
  a.title as activity_title,
  a.status as activity_status
FROM public.enrollments e
JOIN public.activities a ON e.activity_id = a.id
WHERE e.user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY e.enrolled_at DESC;
