-- Seed Activities
-- Creates test volunteering activities
-- Uses current date + future dates for realistic testing

-- Activity 1: STEM Mentorship (Starting next week, ongoing)
INSERT INTO public.activities (
  id,
  title,
  description,
  image_url,
  date,
  start_time,
  end_time,
  location,
  max_participants,
  current_participants,
  eligibility_criteria,
  status,
  category_id,
  created_by
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  'STEM Mentorship Program',
  'Mentor high school students in STEM subjects. Help inspire the next generation of scientists and engineers through hands-on projects and guidance.',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
  '2025-11-23',
  '18:00:00',
  '20:00:00',
  'Engineering Building, Room 203',
  20,
  8,
  'Engineering or Computer Science students, Year 2+',
  'IN_PROGRESS',
  '550e8400-e29b-41d4-a716-446655440001',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Activity 2: Community Outreach (Starting this week)
INSERT INTO public.activities (
  id,
  title,
  description,
  image_url,
  date,
  start_time,
  end_time,
  location,
  max_participants,
  current_participants,
  eligibility_criteria,
  status,
  category_id,
  created_by
) VALUES (
  '660e8400-e29b-41d4-a716-446655440002',
  'Community Outreach Initiative',
  'Organize community events and provide support to local residents. Build connections and make a positive impact in the neighborhood.',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
  '2025-11-20',
  '14:00:00',
  '17:00:00',
  'Community Center, Downtown',
  15,
  12,
  'All students welcome',
  'OPEN',
  '550e8400-e29b-41d4-a716-446655440002',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Activity 3: Environmental Cleanup (Next month)
INSERT INTO public.activities (
  id,
  title,
  description,
  image_url,
  date,
  start_time,
  end_time,
  location,
  max_participants,
  current_participants,
  eligibility_criteria,
  status,
  category_id,
  created_by
) VALUES (
  '660e8400-e29b-41d4-a716-446655440003',
  'River Cleanup Initiative',
  'Join us for a river cleanup event to protect local wildlife and ecosystems. Equipment provided.',
  'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800',
  '2025-12-07',
  '09:00:00',
  '13:00:00',
  'Dâmbovița River, Parcul Tineretului',
  30,
  5,
  'All students, physical activity required',
  'OPEN',
  '550e8400-e29b-41d4-a716-446655440003',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Activity 4: Tutoring Program (Ongoing)
INSERT INTO public.activities (
  id,
  title,
  description,
  image_url,
  date,
  start_time,
  end_time,
  location,
  max_participants,
  current_participants,
  eligibility_criteria,
  status,
  category_id,
  created_by
) VALUES (
  '660e8400-e29b-41d4-a716-446655440004',
  'Math & Science Tutoring',
  'Tutor elementary and middle school students in math and science. Weekly commitment required.',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  '2025-11-22',
  '16:00:00',
  '18:00:00',
  'Library Building, Study Rooms',
  10,
  7,
  'Strong academic record in STEM',
  'IN_PROGRESS',
  '550e8400-e29b-41d4-a716-446655440006',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Activity 5: Cultural Festival (Completed example)
INSERT INTO public.activities (
  id,
  title,
  description,
  image_url,
  date,
  start_time,
  end_time,
  location,
  max_participants,
  current_participants,
  eligibility_criteria,
  status,
  category_id,
  created_by
) VALUES (
  '660e8400-e29b-41d4-a716-446655440005',
  'International Cultural Festival',
  'Help organize and run a cultural festival celebrating diversity on campus.',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  '2025-10-15',
  '10:00:00',
  '18:00:00',
  'Campus Main Square',
  25,
  25,
  'All students',
  'COMPLETED',
  '550e8400-e29b-41d4-a716-446655440004',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT id, title, status, date, location FROM public.activities ORDER BY date DESC;
