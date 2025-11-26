-- =====================================================
-- Migration: Add Custom Message and Rejection Reason to Enrollments
-- Version: 1.0
-- Date: 2024-11-26
-- Description: Adds custom_message and rejection_reason columns to enrollments table
--              These fields support the Application Review Enhancement system
--              from Week 10-11 (Issues #247-#253)
-- =====================================================

-- Add custom_message column for accept/reject messages
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS custom_message TEXT;

-- Add rejection_reason column for tracking why applications were rejected
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add reviewed_at timestamp for tracking when applications were processed
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Add reviewed_by column to track which professor reviewed the application
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id);

-- Create index for reviewed_by for quick lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_reviewed_by
  ON public.enrollments(reviewed_by)
  WHERE reviewed_by IS NOT NULL;

-- Add comments
COMMENT ON COLUMN public.enrollments.custom_message IS 'Custom message sent to student when accepting or rejecting application';
COMMENT ON COLUMN public.enrollments.rejection_reason IS 'Reason for rejecting the application (e.g., "Position filled", "Not qualified")';
COMMENT ON COLUMN public.enrollments.reviewed_at IS 'Timestamp when professor reviewed the application';
COMMENT ON COLUMN public.enrollments.reviewed_by IS 'Professor who reviewed the application';

-- =====================================================
-- Migration Complete
-- =====================================================
