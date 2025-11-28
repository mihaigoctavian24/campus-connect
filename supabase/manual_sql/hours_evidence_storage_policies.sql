-- =====================================================
-- Storage Policies for hours-evidence bucket
-- RULEAZĂ ACEST SQL DIRECT ÎN SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste & Run
-- =====================================================

-- Drop existing policies dacă există (pentru rerun)
DROP POLICY IF EXISTS "Students can upload their own evidence files" ON storage.objects;
DROP POLICY IF EXISTS "Students can view their own evidence files" ON storage.objects;
DROP POLICY IF EXISTS "Professors can view all evidence files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all evidence files" ON storage.objects;
DROP POLICY IF EXISTS "Students can delete their pending evidence files" ON storage.objects;

-- =====================================================
-- POLICY 1: Students can upload evidence files
-- =====================================================
CREATE POLICY "Students can upload their own evidence files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hours-evidence'
  AND auth.uid() IS NOT NULL
);

-- =====================================================
-- POLICY 2: Students can view their own evidence files
-- =====================================================
CREATE POLICY "Students can view their own evidence files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'hours-evidence'
  AND auth.uid() IS NOT NULL
);

-- =====================================================
-- POLICY 3: Professors can view all evidence files
-- =====================================================
CREATE POLICY "Professors can view all evidence files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'hours-evidence'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'professor'
  )
);

-- =====================================================
-- POLICY 4: Admins can view all evidence files
-- =====================================================
CREATE POLICY "Admins can view all evidence files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'hours-evidence'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- =====================================================
-- POLICY 5: Students can delete their own evidence files
-- =====================================================
CREATE POLICY "Students can delete their pending evidence files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'hours-evidence'
  AND auth.uid() IS NOT NULL
);
