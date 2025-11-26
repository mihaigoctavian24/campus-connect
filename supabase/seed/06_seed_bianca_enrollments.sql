-- Seed Enrollments for Professor Bianca Abbasi
-- Creates diverse applications across her 7 activities
-- Demonstrates all statuses: PENDING, CONFIRMED, CANCELLED, WAITLISTED

-- =====================================================
-- Test Session Management Demo (82530993-9b91-411d-b95b-6ccb0dd59a84)
-- =====================================================

-- Enrollment 1: PENDING - Ana Popescu
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience
) VALUES (
  '880e8400-e29b-41d4-a716-446655440001',
  '82530993-9b91-411d-b95b-6ccb0dd59a84',
  '11111111-1111-1111-1111-111111111111',
  'PENDING',
  '2025-11-26 10:30:00',
  'PENDING',
  'Vreau să învăț despre managementul sesiunilor și sistemele de check-in. Această oportunitate îmi va îmbunătăți abilitățile tehnice.',
  'Disponibilă în data de 15 decembrie, oricând după ora 14:00.',
  'Am participat la workshopuri de QR code scanning și GPS tracking în cadrul cursurilor de IoT.'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 2: PENDING - Mihai Ionescu
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience
) VALUES (
  '880e8400-e29b-41d4-a716-446655440002',
  '82530993-9b91-411d-b95b-6ccb0dd59a84',
  '22222222-2222-2222-2222-222222222222',
  'PENDING',
  '2025-11-26 11:15:00',
  'PENDING',
  'Sunt interesat de tehnologiile de management al evenimentelor și aș vrea să văd cum funcționează în practică.',
  'Flexibil, pot participa oricând.',
  'Am experiență cu sisteme de ticketing și attendance tracking din proiectele universitare.'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- River Cleanup Initiative (660e8400-e29b-41d4-a716-446655440003)
-- =====================================================

-- Enrollment 3: CONFIRMED - Ana Popescu (already exists from previous seed)
-- (Skip to avoid duplicate)

-- Enrollment 4: CONFIRMED - Mihai Ionescu
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '880e8400-e29b-41d4-a716-446655440004',
  '660e8400-e29b-41d4-a716-446655440003',
  '22222222-2222-2222-2222-222222222222',
  'CONFIRMED',
  '2025-11-20 14:00:00',
  'PENDING',
  'Protecția mediului este o cauză care îmi pasă foarte mult. Vreau să contribui activ la curățarea râurilor.',
  'Sâmbăta 7 decembrie sunt disponibil tot timpul.',
  'Am participat la 2 campanii de ecologizare organizate de Greenpeace România.',
  'Felicitări Mihai! Aplicația ta a fost acceptată. Te așteptăm la acțiunea de curățare!',
  '2025-11-20 14:10:00',
  'ce3f9b54-984b-450c-898c-ec451804ec3f'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Zilele Sportului (d78c546a-733f-4a3f-9160-4f9953a70e31)
-- =====================================================

-- Enrollment 5: PENDING - Ana Popescu
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience
) VALUES (
  '880e8400-e29b-41d4-a716-446655440005',
  'd78c546a-733f-4a3f-9160-4f9953a70e31',
  '11111111-1111-1111-1111-111111111111',
  'PENDING',
  '2025-11-25 16:45:00',
  'PENDING',
  'Sunt pasionată de sport și mișcare. Aș vrea să ajut la organizarea acestui eveniment și să promovez stilul de viață activ.',
  'Disponibilă 28 noiembrie, toată ziua. Pot ajuta cu pregătirile din ziua precedentă.',
  'Am fost voluntar la maraton București și am coordonat zona de hidratare pentru 200+ participanți.'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 6: WAITLISTED - Mihai Ionescu
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience,
  rejection_reason,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '880e8400-e29b-41d4-a716-446655440006',
  'd78c546a-733f-4a3f-9160-4f9953a70e31',
  '22222222-2222-2222-2222-222222222222',
  'WAITLISTED',
  '2025-11-25 17:20:00',
  'PENDING',
  'Îmi place sportul și aș vrea să contribui la succesul acestui eveniment.',
  'Disponibil tot weekendul.',
  'Am fost arbitru voluntar la competiții de baschet în liceu.',
  'Poziția a fost ocupată',
  'Mulțumim pentru aplicație Mihai! Toate pozițiile au fost ocupate, dar te-am adăugat în lista de așteptare. Dacă se eliberează un loc, te vom contacta imediat. Mult succes!',
  '2025-11-25 17:25:00',
  'ce3f9b54-984b-450c-898c-ec451804ec3f'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEM Mentorship Program (660e8400-e29b-41d4-a716-446655440001)
-- =====================================================

-- Enrollment 7: CONFIRMED - Ana Popescu (already exists from previous seed)
-- (Skip to avoid duplicate)

-- Enrollment 8: CANCELLED (rejected) - New student profile needed
-- Using existing Mihai for this one with different reason
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience,
  rejection_reason,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '880e8400-e29b-41d4-a716-446655440008',
  '660e8400-e29b-41d4-a716-446655440001',
  '22222222-2222-2222-2222-222222222222',
  'CANCELLED',
  '2025-11-18 09:30:00',
  'PENDING',
  'Vreau să contribui la educația STEM pentru tineri.',
  'Disponibil doar weekenduri.',
  'Nu am experiență anterioară în mentorat.',
  'Conflict de program',
  'Îți mulțumim pentru aplicație Mihai! Din păcate, programul nostru necesită disponibilitate în timpul săptămânii pentru sesiunile de mentorat. Te încurajăm să te uiți la alte oportunități de voluntariat care se desfășoară în weekend. Mult succes!',
  '2025-11-18 09:40:00',
  'ce3f9b54-984b-450c-898c-ec451804ec3f'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Math & Science Tutoring (660e8400-e29b-41d4-a716-446655440004)
-- =====================================================

-- Enrollment 9: CONFIRMED - Ana Popescu (already exists from previous seed)
-- (Skip to avoid duplicate)

-- Enrollment 10: PENDING - Mihai Ionescu
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience
) VALUES (
  '880e8400-e29b-41d4-a716-446655440010',
  '660e8400-e29b-41d4-a716-446655440004',
  '22222222-2222-2222-2222-222222222222',
  'PENDING',
  '2025-11-26 13:20:00',
  'PENDING',
  'Matematica și științele sunt punctele mele forte. Aș vrea să ajut elevii să-și dezvolte aceste abilități.',
  'Luni, miercuri, vineri după ora 17:00.',
  'Am făcut meditații la matematică pentru 5 colegi anul trecut. Toți au promovat examenele.'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Community Outreach Initiative (660e8400-e29b-41d4-a716-446655440002)
-- =====================================================

-- Enrollment 11: CONFIRMED - Ana Popescu (already exists from previous seed)
-- Enrollment 12: CONFIRMED - Mihai Ionescu (already exists from previous seed)
-- (Skip both to avoid duplicates)

-- =====================================================
-- International Cultural Festival (660e8400-e29b-41d4-a716-446655440005)
-- =====================================================

-- Enrollment 13: CONFIRMED - Ana Popescu (already exists - completed with feedback)
-- (Skip to avoid duplicate)

-- Enrollment 14: CANCELLED - Mihai Ionescu
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience,
  rejection_reason,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '880e8400-e29b-41d4-a716-446655440014',
  '660e8400-e29b-41d4-a716-446655440005',
  '22222222-2222-2222-2222-222222222222',
  'CANCELLED',
  '2025-09-28 11:00:00',
  'PENDING',
  'Îmi place diversitatea culturală și vreau să promovez toleranța și înțelegerea între culturi.',
  'Flexibil pentru toate etapele.',
  'Am participat ca voluntar la 3 evenimente culturale în liceu.',
  'Profilul nu se potrivește cerințelor',
  'Mulțumim pentru interes Mihai! După analiză, am decis să selectăm candidați cu experiență în coordonarea de echipe pentru acest eveniment complex. Aplicația ta arată dedicare, dar căutăm persoane cu rol de leadership în evenimente similare. Te încurajăm să aplici pentru alte oportunități!',
  '2025-09-28 11:15:00',
  'ce3f9b54-984b-450c-898c-ec451804ec3f'
) ON CONFLICT (id) DO NOTHING;

-- Verify enrollments for Bianca's activities
SELECT
  e.id,
  e.status,
  a.title as activity_title,
  p.first_name || ' ' || p.last_name as student_name,
  e.enrolled_at
FROM public.enrollments e
JOIN public.activities a ON e.activity_id = a.id
JOIN public.profiles p ON e.user_id = p.id
WHERE a.created_by = 'ce3f9b54-984b-450c-898c-ec451804ec3f'
ORDER BY e.enrolled_at DESC;
