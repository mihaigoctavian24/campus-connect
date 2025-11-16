-- =====================================================
-- Migration: Database Performance Optimization
-- Version: 1.0
-- Date: 2024-11-16
-- Description: Performance optimizations for Issue #20
--              - Full-text search on activities
--              - Composite indexes for common queries
--              - Partial indexes for active records
--              - pg_stat_statements setup
-- =====================================================

-- =====================================================
-- FULL-TEXT SEARCH: Activities
-- =====================================================

-- Add tsvector column for full-text search
ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(location, '')), 'C')
) STORED;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_activities_search
ON public.activities USING GIN(search_vector);

COMMENT ON COLUMN public.activities.search_vector IS 'Full-text search vector for title, description, location';

-- =====================================================
-- COMPOSITE INDEXES: Common Query Patterns
-- =====================================================

-- Query: Find open activities by category and date
CREATE INDEX IF NOT EXISTS idx_activities_category_date_status
ON public.activities(category_id, date, status)
WHERE deleted_at IS NULL AND status = 'OPEN';

-- Query: Find user's enrollments with status
CREATE INDEX IF NOT EXISTS idx_enrollments_user_status
ON public.enrollments(user_id, status)
WHERE deleted_at IS NULL;

-- Query: Find activity enrollments by status
CREATE INDEX IF NOT EXISTS idx_enrollments_activity_status
ON public.enrollments(activity_id, status)
WHERE deleted_at IS NULL;

-- Query: Find pending hours requests for professor
CREATE INDEX IF NOT EXISTS idx_hours_requests_activity_status
ON public.hours_requests(activity_id, status)
WHERE status = 'PENDING';

-- Query: Find approved hours for user
CREATE INDEX IF NOT EXISTS idx_hours_requests_user_approved
ON public.hours_requests(user_id, approved_at DESC)
WHERE status = 'APPROVED';

-- Query: Find user's saved opportunities
CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user
ON public.saved_opportunities(user_id, saved_at DESC);

-- Query: Find sessions for activity by date
CREATE INDEX IF NOT EXISTS idx_sessions_activity_date
ON public.sessions(activity_id, date);

-- Note: Index with NOW() in WHERE clause removed (not immutable)
-- Query active QR codes must filter at application level

-- Query: Find unread notifications for user
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread_created
ON public.notifications(user_id, created_at DESC)
WHERE is_read = FALSE;

-- =====================================================
-- PARTIAL INDEXES: Active Records Only
-- =====================================================

-- Active activities only (most common query)
CREATE INDEX IF NOT EXISTS idx_activities_active_date
ON public.activities(date, start_time)
WHERE deleted_at IS NULL AND status IN ('OPEN', 'IN_PROGRESS');

-- Active enrollments only
CREATE INDEX IF NOT EXISTS idx_enrollments_active
ON public.enrollments(activity_id, user_id)
WHERE deleted_at IS NULL AND status = 'CONFIRMED';

-- Active departments only
CREATE INDEX IF NOT EXISTS idx_departments_active
ON public.departments(name)
WHERE is_active = TRUE;

-- Active categories only
CREATE INDEX IF NOT EXISTS idx_categories_active
ON public.categories(name)
WHERE is_active = TRUE;

-- =====================================================
-- PERFORMANCE MONITORING: pg_stat_statements
-- =====================================================

-- Enable pg_stat_statements extension for query performance monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

COMMENT ON EXTENSION pg_stat_statements IS 'Track execution statistics of all SQL statements. Use SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20 to find slow queries.';

-- =====================================================
-- QUERY HELPER FUNCTIONS
-- =====================================================

-- Function to search activities with full-text search
CREATE OR REPLACE FUNCTION public.search_activities(
  p_search_query TEXT,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  date DATE,
  start_time TIME,
  location TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.description,
    a.date,
    a.start_time,
    a.location,
    ts_rank(a.search_vector, websearch_to_tsquery('english', p_search_query)) AS rank
  FROM public.activities a
  WHERE a.search_vector @@ websearch_to_tsquery('english', p_search_query)
    AND a.deleted_at IS NULL
    AND a.status = 'OPEN'
  ORDER BY rank DESC, a.date ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.search_activities IS 'Full-text search for activities with relevance ranking. Use websearch syntax: "volunteering education" or "technology -sports"';

-- Function to get slow queries from pg_stat_statements
CREATE OR REPLACE FUNCTION public.get_slow_queries(p_limit INTEGER DEFAULT 20)
RETURNS TABLE(
  query TEXT,
  calls BIGINT,
  total_time_ms DOUBLE PRECISION,
  mean_time_ms DOUBLE PRECISION,
  max_time_ms DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    LEFT(s.query, 200) AS query,
    s.calls,
    ROUND((s.total_exec_time)::NUMERIC, 2) AS total_time_ms,
    ROUND((s.mean_exec_time)::NUMERIC, 2) AS mean_time_ms,
    ROUND((s.max_exec_time)::NUMERIC, 2) AS max_time_ms
  FROM pg_stat_statements s
  WHERE s.query NOT LIKE '%pg_stat_statements%'
  ORDER BY s.total_exec_time DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_slow_queries IS 'Get slowest queries from pg_stat_statements. Run SELECT * FROM get_slow_queries(20) to identify performance bottlenecks.';

-- =====================================================
-- VACUUM AND ANALYZE
-- =====================================================

-- Analyze all tables to update statistics for query planner
ANALYZE public.profiles;
ANALYZE public.categories;
ANALYZE public.departments;
ANALYZE public.activities;
ANALYZE public.enrollments;
ANALYZE public.sessions;
ANALYZE public.hours_requests;
ANALYZE public.saved_opportunities;
ANALYZE public.notifications;
ANALYZE public.certificates;
ANALYZE public.feedback;
ANALYZE public.audit_logs;
ANALYZE public.email_templates;
ANALYZE public.platform_settings;

-- =====================================================
-- CONNECTION POOLING NOTES
-- =====================================================

-- Connection pooling is configured at Supabase project level:
-- 1. Default pool size: 15 connections
-- 2. PgBouncer enabled by default
-- 3. Transaction mode recommended for serverless functions
-- 4. Session mode for persistent connections
--
-- To verify: SELECT * FROM pg_stat_database WHERE datname = current_database();
-- To check active connections: SELECT count(*) FROM pg_stat_activity;

-- =====================================================
-- Migration Complete
-- =====================================================
