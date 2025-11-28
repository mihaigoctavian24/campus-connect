-- =====================================================
-- Storage Policies for hours-evidence bucket
-- =====================================================
-- IMPORTANT: Bucket-ul 'hours-evidence' trebuie creat manual în Supabase Dashboard:
-- 1. Navigate to Storage → New bucket
-- 2. Name: hours-evidence
-- 3. Public: YES (pentru ca students să vadă dovezile uploaded)
-- 4. File size limit: 5MB
-- 5. Allowed MIME types: image/jpeg, image/png, image/jpg, application/pdf

-- Enable RLS on storage.objects (dacă nu este deja enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

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
-- (doar dacă hours request este încă PENDING)
-- =====================================================
CREATE POLICY "Students can delete their pending evidence files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'hours-evidence'
  AND auth.uid() IS NOT NULL
);

COMMENT ON TABLE storage.objects IS 'Storage policies for hours-evidence bucket configured';
