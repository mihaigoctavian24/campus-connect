-- Add GPA column to profiles table
-- GPA is stored as NUMERIC(3,2) to support values like 10.00, 9.75, etc.

ALTER TABLE profiles
ADD COLUMN gpa NUMERIC(3,2) CHECK (gpa >= 0 AND gpa <= 10);

COMMENT ON COLUMN profiles.gpa IS 'Student GPA (Grade Point Average) on 10-point scale, e.g., 9.75';
