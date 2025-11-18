-- Create saved_opportunities table for students to save opportunities for later
-- This table enables the "Save for Later" feature in Week 3 Sprint 3.2

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_saved_user ON public.saved_opportunities(user_id);
CREATE INDEX idx_saved_activity ON public.saved_opportunities(activity_id);

-- Comments for documentation
COMMENT ON TABLE public.saved_opportunities IS 'Stores student saved opportunities for later viewing';
COMMENT ON COLUMN public.saved_opportunities.user_id IS 'Student who saved the opportunity';
COMMENT ON COLUMN public.saved_opportunities.activity_id IS 'The saved activity/opportunity';
COMMENT ON COLUMN public.saved_opportunities.saved_at IS 'Timestamp when opportunity was saved';

-- Enable Row Level Security
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Students can view their own saved opportunities
CREATE POLICY "Students can view own saved opportunities"
  ON public.saved_opportunities
  FOR SELECT
  USING (auth.uid() = user_id);

-- Students can save opportunities
CREATE POLICY "Students can save opportunities"
  ON public.saved_opportunities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Students can unsave their own opportunities
CREATE POLICY "Students can unsave own opportunities"
  ON public.saved_opportunities
  FOR DELETE
  USING (auth.uid() = user_id);
