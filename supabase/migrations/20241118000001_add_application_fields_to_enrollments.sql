-- Add application fields to enrollments table
-- This migration adds columns to store student application information
-- when they apply to volunteer opportunities

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS motivation TEXT,
  ADD COLUMN IF NOT EXISTS availability TEXT,
  ADD COLUMN IF NOT EXISTS experience TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.enrollments.motivation IS 'Student''s motivation for applying to the activity';
COMMENT ON COLUMN public.enrollments.availability IS 'Student''s availability schedule for the activity';
COMMENT ON COLUMN public.enrollments.experience IS 'Student''s relevant experience (optional)';
