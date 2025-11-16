-- Seed Test Users (Profiles)
-- Creates test student, professor, and admin accounts
-- Note: These need to be created in Supabase Auth first, this just adds profile data

-- Test Student 1
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  faculty,
  specialization,
  year,
  program_type,
  role,
  is_active,
  email_verified
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'student1@stud.rau.ro',
  'Ana',
  'Popescu',
  'Engineering Sciences',
  'Computer Science',
  2,
  'LICENSE',
  'STUDENT',
  true,
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Test Student 2
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  faculty,
  specialization,
  year,
  program_type,
  role,
  is_active,
  email_verified
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'student2@stud.rau.ro',
  'Mihai',
  'Ionescu',
  'Computer Science & Information Engineering',
  'Software Engineering',
  3,
  'LICENSE',
  'STUDENT',
  true,
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Test Professor
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  email_verified
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'prof.smith@rau.ro',
  'John',
  'Smith',
  'PROFESSOR',
  true,
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Verify
SELECT id, email, first_name, last_name, role FROM public.profiles ORDER BY role, email;
