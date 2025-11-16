-- Seed Categories
-- Insert test categories for activities

INSERT INTO public.categories (id, name, description, color, icon, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'STEM Education', 'Science, Technology, Engineering, Math programs', '#3b82f6', '🔬', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Community Service', 'Local community outreach and support', '#10b981', '🤝', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Environmental', 'Environmental awareness and conservation', '#22c55e', '🌱', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Cultural', 'Cultural events and heritage preservation', '#f59e0b', '🎭', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Health & Wellness', 'Health education and wellness programs', '#ef4444', '❤️', true),
  ('550e8400-e29b-41d4-a716-446655440006', 'Education Support', 'Tutoring and educational assistance', '#8b5cf6', '📚', true)
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT * FROM public.categories ORDER BY name;
