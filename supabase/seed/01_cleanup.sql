-- Cleanup Script
-- Deletes all test data from Supabase tables
-- Run this before seeding to start fresh

-- Disable RLS temporarily for cleanup
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Delete all data (respects foreign key constraints)
DELETE FROM public.enrollments;
DELETE FROM public.activities;
DELETE FROM public.categories;
DELETE FROM public.profiles WHERE id != auth.uid(); -- Keep current user

-- Re-enable RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verify cleanup
SELECT 'enrollments' as table_name, COUNT(*) as count FROM public.enrollments
UNION ALL
SELECT 'activities', COUNT(*) FROM public.activities
UNION ALL
SELECT 'categories', COUNT(*) FROM public.categories
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles;
